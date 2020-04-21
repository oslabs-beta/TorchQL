const Generator = require('../generators/resolverGenerator');

// returns query resolvers for each table in SDL format as array of strings
function createResolvers(data) {
	let queries = '';
	let mutations = '';
	for (tableName in data) {
		const { primaryKey } = data[tableName];
		const tableData = data[tableName];
		queries += Generator.queries(tableName, primaryKey);
		mutations += Generator.mutations(tableName, tableData)
	}
	return { queries, mutations };
}

// formats and returns all resolvers in SDL as single string for rendering on front-end
function combineResolvers(queryResolvers, mutationResolvers) {
	return 'const resolvers = {\n'
		+ '  Query: {'
		+ `    ${queryResolvers}\n`
		+ '  }\n\n'
		+ '  Mutation: {\n'
		+ `${mutationResolvers}`
		+ '  }\n'
		+ '}\n';
}

module.exports = {
	createResolvers,
	combineResolvers
};