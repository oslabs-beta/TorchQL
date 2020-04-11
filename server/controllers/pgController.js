const fs = require('fs');
const { Pool } = require('pg');
const pgQuery = fs.readFileSync('server/queries/tableData.sql', 'utf8');
const pgController = {};
const { createQuery, createTypes } = require('../functions/typesCreator');

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
        log: '',
        status: 500,
        message: { err },
      })
    );
};

// middleware function for making query root types in SDL
pgController.makeQueries = (req, res, next) => {
  let queries = createQuery(res.locals.tables);
  console.log('queries: ', queries);
  return next();
};

// middleware function for making custom object types in SDL
pgController.makeTypes = (req, res, next) => {
  let types = createTypes(res.locals.tables);
  console.log('types: ', types);
  return next();
};

pgController.makeQueryResolvers = (req, res, next) => {
  const data = res.locals.tables;
  const tableNamesAndKeys = data.map((table) => {
    const arr = [];
    arr.push(table.table_name);
    arr.push(table.primary_key);
    return arr;
  });
  const lowercaseString = (string) => {
    return string[0].toLowerCase() + string.slice(1);
  };

  const generateGetAllQuery = (tableName) => {
    return `${lowercaseString(tableName)}: () => {
        try{
            const query = 'SELECT * FROM ${tableName}';
            return db.query(query).then((res) => res.rows)
        } catch (err) {
            throw new Error(err);
        }
    }
    `;
  };

  const generateGetOneQuery = (tableName, id) => {
    return `${lowercaseString(tableName)}ById: (parent, args) => {
        try{
            const query = 'SELECT * FROM ${tableName} WHERE ${id} = $1';
            const values = [args.${id}]
            return db.query(query).then((res) => res.rows)
        } catch (err) {
            throw new Error(err);
        }
    }
    `;
  };

  const generateQueryResolvers = () => {
    let queriesAll = [];
    let queriesById = [];
    tableNamesAndKeys.forEach((sub) => {
      queriesAll.push(generateGetAllQuery(sub[0]));
      queriesById.push(generateGetOneQuery(sub[0], sub[1]));
    });
    return `Query: {
        ${queriesAll},
        ${queriesById}
    }`;
  };

  res.locals.queries = generateQueryResolvers();
  return next();
};

// TODO: Fix the commented-out conditional in tablesAndColumns - for some reason these values are undefined when run. They're defined when logged to the console, however.
pgController.makeMutationResolvers = (req, res, next) => {
  const data = res.locals.tables;
  const tableNamesAndKeys = data.map((table) => {
    const arr = [];
    arr.push(table.table_name);
    arr.push(table.primary_key);
    return arr;
  });
  const tablesAndColumns = data.map((table) => {
    const obj = {};
    const tableName = table.table_name;
    obj[tableName] = [];
    for (let i = 0; i < table.columns.length; i++) {
      const column = table.columns[i];
      //   const primaryKey = tableNamesAndKeys[i][1];
      //   if (column.column_name !== primaryKey) {
      obj[tableName].push(column.column_name);
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

  res.locals.mutations = generateMutationResolvers();
  return next();
};

module.exports = pgController;