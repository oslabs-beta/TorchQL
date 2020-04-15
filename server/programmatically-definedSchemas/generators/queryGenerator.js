const { singular } = require('pluralize');
const { capitalize } = require('../../SDL-definedSchemas/helpers/helperFunctions');

const QueryGenerator = {};


// RootQuery output to get all tables
QueryGenerator.allColumns = table => {
  const singularName = singular(table);
  const capSingle = capitalize(singularName)
    return `    ${table}: {\n`
    +`    type: new GraphQLList(${capSingle}Type),\n`
    +`      resolve() { \n`
    +`        try { \n`
    +`          const query = \`SELECT * FROM ${table}\`\n`
    +`          return db.query(query).then((res) => res.rows);\n`
    +`        } catch (err){\n`
    +`          throw new Error(err);\n`
    +`        },\n`
    +`      }\n`
    +`    },\n`  
};



// RootQuery output to get single table by id
QueryGenerator.column = table => {
  const singlularName = singular(table);
  const capSingle = capitalize(singularName);
    return `${singlularName}ById: {`
    +`    type: ${capSingle}Type,\n`
    +`    args: {\n`
    // +`    id: { type: GraphQL${placeholder}},\n`
    +`   },`
    +`   resolver(parent, args) {\n`
    +`      try {\n`
    +`            const query = \`SELECT * FROM ${table}\n`
    +`            WHERE ${primaryKey} = $1\`;\n`
    +`            const values = [args.${primaryKey}];`
    +`            return db.query(query, values).then((res) => res.rows[0]);\n`
    +`          } catch (err) {\n`
    +`            throw new Error(err);\n`
    +`          }\n`
    +`      },\n`
    +`   },\n`
};

module.exports = QueryGenerator;