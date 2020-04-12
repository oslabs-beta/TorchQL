const fs = require('fs');
const { Pool } = require('pg');
const pgQuery = fs.readFileSync('server/queries/tableData.sql', 'utf8');
const pgController = {};
const { createQuery, createMutation, createTypes, formatTypeDefs } = require('../functions/typesCreator');
const { generateGetAllQuery, generateGetOneQuery, generateQueryResolvers, formatResolvers } = require('../functions/resolversCreator');

// middleware function for recovering info from pg tables
pgController.getPGTables = (req, res, next) => {
  const db = new Pool({ connectionString: req.body.DB_URI });
  db.query(pgQuery)
    .then((data) => {
      res.locals.tables = data.rows;
      return next();
    })
    .catch((err) =>
      next({
        log: 'There was a problem making database query',
        status: 500,
        message: { err },
      })
    );
};

// middleware function for making query root types in SDL
pgController.makeQueries = (req, res, next) => {
  let queries = createQuery(res.locals.tables);
  res.locals.queries = queries;
  return next();
};

// middleware function for making mutation root types in SDL
pgController.makeMutations = (req, res, next) => {
  let mutations = createMutation(res.locals.tables);
  res.locals.mutations = mutations;
  return next();
}

// middleware function for making custom object types in SDL
pgController.makeTypes = (req, res, next) => {
  const types = createTypes(res.locals.tables);
  res.locals.types = types;
  return next();
};

// middleware function for returning formatted type definitions in SDL as string
pgController.returnTypeDefs = (req, res, next) => {
  const { queries, mutations, types } = res.locals;
  res.locals.allTypeDefs = formatTypeDefs(queries, mutations, types);
  return next();
}

// middleware function for making query resolvers in SDL as string
pgController.makeQueryResolvers = (req, res, next) => {
  const queryAllResolvers = generateGetAllQuery(res.locals.tables);
  const queryOneResolvers = generateGetOneQuery(res.locals.tables);
  res.locals.queryResolvers = generateQueryResolvers(queryAllResolvers, queryOneResolvers);
  return next();
};

// middleware function for returning formatted resolvers in SDL as string
pgController.returnResolvers = (req, res, next) => {
  const { queryResolvers, mutationResolvers } = res.locals;
  res.locals.resolvers = formatResolvers(queryResolvers, mutationResolvers);
  return next();
}

// TODO: Fix the commented-out conditional in tablesAndColumns - for some reason these values are undefined when run. They're defined when logged to the console, however.
pgController.makeMutationResolvers = (req, res, next) => {
  const data = res.locals.tables;
  const tableNamesAndKeys = data.map((table) => {
    const arr = [];
    arr.push(table.tableName);
    arr.push(table.primaryKey);
    return arr;
  });
  const tablesAndColumns = data.map((table) => {
    const obj = {};
    const tableName = table.tableName;
    obj[tableName] = [];
    for (let i = 0; i < table.columns.length; i++) {
      const column = table.columns[i];
      //   const primaryKey = tableNamesAndKeys[i][1];
      //   if (column.columnName !== primaryKey) {
      obj[tableName].push(column.columnName);
      //   }
    }
    return obj;
  });
  const upperCaseString = (string) => {
    return string[0].toUpperCase() + string.slice(1);
  };

  const createValuesArray = (array) => {
    let output = [];
    for (i = 1; i <= array.length; i++) {
      console.log(i);
      if (i < array.length) output.push(`$${i}, `);
      else output.push(`$${i}`);
    }
    return output.join(' ');
  };

  const generateCreateMutation = (tableName, columns) => {
    return `create${upperCaseString(tableName)}: () => {
          try{
              const query = 'INSERT INTO ${tableName}(${columns[0].join(', ')})
              VALUES(${createValuesArray(columns[0])})';
              const values = ${columns[0]}
              return db.query(query, values)
          } catch (err) {
              throw new Error(err);
          }
      }
      `;
  };

  const generateUpdateMutation = (tableName, columns, id) => {
    const setStatement = (input) => {
      let output = [];
      let count = 1;
      for (const el of input) {
        output.push(`${el} = $${count}`);
        count++;
      }
      return output.join(', ');
    };
    return `update${upperCaseString(tableName)}: (parent, args => {
          try{
              const query = 'UPDATE ${tableName} 
              SET ${setStatement(columns[0])}
              WHERE ${id} = $${columns[0].length}';
              const values = [args.${id}]
              return db.query(query).then((res) => res.rows)
          } catch (err) {
              throw new Error(err);
          }
      }
      `;
  };

  const generateDeleteMutation = (tableName, id) => {
    return `delete${upperCaseString(tableName)}: (parent, args) => {
            try{
                const query = 'DELETE FROM ${tableName} 
                WHERE ${id} = $1';
                const values = [args.${id}]
                return db.query(query).then((res) => res.rows)
            } catch (err) {
                throw new Error(err);
            }
        }
        `;
  };

  const generateMutationResolvers = () => {
    const createArr = [];
    const updateArr = [];
    const deleteArr = [];

    for (let i = 0; i < tableNamesAndKeys.length; i++) {
      let currentTable = tableNamesAndKeys[i][0];
      let primaryKey = tableNamesAndKeys[i][1];
      createArr.push(
        generateCreateMutation(currentTable, Object.values(tablesAndColumns[i]))
      );
      updateArr.push(
        generateUpdateMutation(
          currentTable,
          Object.values(tablesAndColumns[i], primaryKey)
        )
      );
      deleteArr.push(generateDeleteMutation(currentTable, primaryKey));
    }
    return `Mutation: {
          ${createArr}
          ${updateArr}
          ${deleteArr}
      }`;
  };

  res.locals.mutationResolvers = generateMutationResolvers();
  return next();
};

module.exports = pgController;
