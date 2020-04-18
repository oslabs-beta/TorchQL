const { singular } = require('pluralize');
const { capitalize, toCamelCase, typeSet, getRelationships } = require('./helperFunctions');
const Generator = require('./../generators/typeGenerator');

// returns query root types for each table in SDL format as array of strings
function createQuery(data) {
	const allQueries = [];
  const tables = Object.keys(data);
	for (let tableName of tables) {
    const nameSingular = singular(tableName);
    let typeStr = `${tableName}:[${capitalize(nameSingular)}!]!\n    ${nameSingular}ByID(${nameSingular}id:ID):${capitalize(nameSingular)}!`;
		allQueries.push(typeStr);
	};
  return allQueries;
}

// returns create, update, and deletion mutation root types for each table in SDL format as array of strings
function createMutation(data) {
	const allMutations = [];
  const tables = Object.keys(data);
	for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const { primaryKey, foreignKeys, columns } = data[table];
		let typeStr = Generator.create(table, primaryKey, foreignKeys, columns)
		  + Generator.update(table, primaryKey, foreignKeys, columns)
		  + Generator.destroy(table, primaryKey);
		allMutations.push(typeStr);
	};
	return allMutations;
}

// returns object types for each table in SDL format as array of strings
function createTypes(data) {
	const allTypes = [];
  const tables = Object.keys(data);
	// iterates through each data object corresponding to single table in PostgreSQL database
  for(let i = 0; i < tables.length; i++) {
    const tableName = tables[i];
    const { primaryKey, foreignKeys, referencedBy, columns } = data[tableName];
    const columnNames = Object.keys(columns);
    if (foreignKeys === null || columnNames.length !== Object.keys(foreignKeys).length + 1) {
      let typeStr = `\n  type ${toCamelCase(capitalize(singular(tableName)))} {\n    ${toCamelCase(primaryKey)}: ID!`;
      // adds all columns with types to string
      for (let columnName of columnNames) {
        if (!(foreignKeys && foreignKeys[columnName]) && columnName !== primaryKey) {
          const { dataType, isNullable } = columns[columnName];
          typeStr += `\n    ${toCamelCase(columnName)}: ${typeSet(dataType)}`;
          if (isNullable === 'YES') typeStr += '!';
        }
    	}
      typeStr += getRelationships(data, tableName, referencedBy);
    	typeStr += '\n  }';
    	allTypes.push(typeStr);
    }
  }
  return allTypes;
}

// formats and returns queries, mutations, and object types in SDL as single string for rendering on front-end
function formatTypeDefs(queries, mutations, types) {
	return 'const typeDefs = `\n'
    + '  type Query {\n'
    + `    ${queries.join('\n    ')}\n`
    + '  }\n\n'
    + '  type Mutation {\n'
    + `    ${mutations.join('\n    ')}\n`
    + '  }\n'
		+ `${types.join('\n')} \n\n\`;\n\n`;
}

module.exports = {
	createQuery,
	createMutation,
	createTypes,
	formatTypeDefs
};
