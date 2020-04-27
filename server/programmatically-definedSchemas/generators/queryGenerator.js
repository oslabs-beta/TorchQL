const { singular } = require('pluralize');
const { toPascalCase, toCamelCase } = require('../helpers/helperFunctions');
const QueryGenerator = {};


// RootQuery output to get all tables
QueryGenerator.allColumns = table => {
  const singleName = singular(table);
    return `${toCamelCase(table)}: {\n`
    +`    type: ${toPascalCase(singleName)}Type,\n`
    +`      resolve() { \n`
    +`        try { \n`
    +`          const query = \`SELECT * FROM ${table}\`\n`
    +`          return db.query(query).then((res) => res.rows);\n`
    +`        } catch (err){\n`
    +`          throw new Error(err);\n`
    +`        },\n`
    +`      },\n`
    +`    },\n`  
};



// RootQuery output to get single table by id
QueryGenerator.column = (table, primaryKey) => {
  const singleName = singular(table);
    return `${toCamelCase(singleName)}ById: {\n`
    +`    type: ${toPascalCase(singleName)}Type,\n`
    +`    args: {\n`
    +`      id: { type: GraphQL[placeholder] },\n` // <-- need to replace placer holder with string/num/id/list
    +`    },\n`
    +`    resolver(parent, args) {\n`
    +`      try {\n`
    +`        const query = 'SELECT * FROM ${table}\n`
    +`        WHERE ${primaryKey} = $1';\n`
    +`        const values = [args.${primaryKey}];\n`
    +`        return db.query(query, values).then((res) => res.rows[0]);\n`
    +`      } catch (err) {\n`
    +`        throw new Error(err);\n`
    +`      }\n`
    +`    },\n`
    +`  }\n`
};

module.exports = QueryGenerator;