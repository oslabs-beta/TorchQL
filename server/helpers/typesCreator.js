const { singular } = require('pluralize');
const { capitalize, toCamelCase } = require('./helperFunctions');
const Generator = require('./../generators/typeGenerator');

// returns query and mutation root types for each table in SDL format as array of strings
function createTypes(tables) {
	let queries = '';
  let mutations = '';
  let customTypes = '';
	for (let tableName in tables) {
		queries += Generator.queries(tableName);
    mutations += Generator.mutations(tableName, tables[tableName]);
    customTypes += Generator.customTypes(tableName, tables);
	}
  return { queries, mutations, customTypes };
}

// formats and returns queries, mutations, and object types in SDL as single string for rendering on front-end
function formatTypeDefs(queries, mutations, customTypes) {
	return 'const typeDefs = `\n'
    + '  type Query {\n'
    + `    ${queries}\n`
    + '  }\n\n'
    + '  type Mutation {\n'
    + `    ${mutations}\n`
    + '  }\n\n'
		+ `${customTypes}\`;\n\n`;
}

module.exports = {
	createTypes,
	formatTypeDefs
};
