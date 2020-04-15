const { singular } = require('pluralize');
const { capitalize } = require('../helpers/helperFunctions');

const QueryGenerator = {};

QueryGenerator.allColumns = table => {
    const singularName = singular(table);
    capSingle = capitalize(singularName)

    // RootQuery output to get all tables
    return `    ${table}: {\n`
    +`    type: new GraphQLList(${capSingle}Type),\n`
    +`      resolve() { \n`
    +`        try { \n`
    +`          const query = \`SELECT * FROM ${table}\``
    +`          return db.query(query).then((res) => res.rows);\n`
    +`        } catch (err){\n`
    +`          throw new Error(err);\n`
    +`        },\n`
    +`      }\n`
    +`    },\n`  
}

QueryGenerator.column = table => {
    const singlularName = singular(table);
    capSingle = capitalize(singularName);

    // RootQuery output to get single table by id
    return `${table}: {`
}



