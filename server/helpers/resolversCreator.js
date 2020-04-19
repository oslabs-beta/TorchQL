const Generator = require('../generators/resolverGenerator');

// returns query resolvers for each table in SDL format as array of strings
function generateQueryResolvers(data) {
	let queries = '';
	for (tableName in data) {
		const { primaryKey } = data[tableName];
		const resolveOneStr = Generator.column(tableName, primaryKey);
		const resolveAllStr = Generator.allColumn(tableName);
		queries += `\n${resolveOneStr}\n${resolveAllStr}`;
	}
	return queries;
}

// formats and returns mutation resolvers arranged by table in SDL as single string 
function generateMutationResolvers(data) {
	let mutations = '';
	for (let tableName in data) {
		const { primaryKey, foreignKeys, columns } = data[tableName];
		mutations += `${Generator.createColumn(tableName, primaryKey, foreignKeys, columns)}\n`
			+ `${Generator.updateColumn(tableName, primaryKey, foreignKeys, columns)}\n`
			+ `${Generator.deleteColumn(tableName, primaryKey)}\n\n`;
	}
	return mutations;
}

// formats and returns all resolvers in SDL as single string for rendering on front-end
function formatResolvers(queryResolvers, mutationResolvers) {
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
	generateQueryResolvers,
	generateMutationResolvers,
	formatResolvers
};