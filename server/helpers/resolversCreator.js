const { storeForeignKeys } = require('./helperFunctions');
const { storeIndexedColumns } = require('./helperFunctions');
const Generator = require('./../generators/resolverGenerator');

// returns get all query resolvers for each table in SDL format as array of strings
function generateGetAllQuery(data) {
	const queriesAll = [];
	// iterates through each data object corresponding to single table in PostgreSQL database
	const tables = Object.keys(data);
	for (tableName of tables) {
		let resolveStr = Generator.allColumns(tableName);
	queriesAll.push(resolveStr);
	}
	return queriesAll;
}

// returns get one query resolvers for each table in SDL format as array of strings
function generateGetOneQuery(data) {
	const queriesById = [];
	// iterates through each data object corresponding to single table in PostgreSQL database
	const tables = Object.keys(data);
	for (tableName of tables) {
		const { primaryKey } = data[tableName];
		let resolveStr = Generator.column(tableName, primaryKey);
		queriesById.push(resolveStr);
	}
	return queriesById;
}

// formats and returns query resolvers arranged by table in SDL as single string 
function generateQueryResolvers(arr1, arr2) {
	let resolveStr = '';
	for (i = 0; i < arr1.length; i++) resolveStr += `\n${arr1[i]}\n${arr2[i]}`;
	return resolveStr;
}

// formats and returns mutation resolvers arranged by table in SDL as single string 
function generateMutationResolvers(data) {
	const allMutResolvers = [];
	const tables = Object.keys(data);
	for (let i = 0; i < tables.length; i++) {
		const tableName = tables[i]
		const { primaryKey, foreignKeys, columns } = data[tableName];
		// stores foreign keys and associated properties as an object
		const fkCache = storeForeignKeys(foreignKeys);
		// stores columns that are not primary or foreign keys as values in indexed object 
		const valueObj = storeIndexedColumns(columns, primaryKey, fkCache);
		// skip tables with columns with only primary and foreign keys
		if (Object.entries(valueObj).length === 0) continue;
		allMutResolvers.push(createMutResolvers(tableName, valueObj));
		allMutResolvers.push(updateMutResolvers(tableName, data[tableName], valueObj));
		allMutResolvers.push(deleteMutResolvers(tableName, data[tableName]));
	}
	return assembleMutResolvers(allMutResolvers);
}

// returns create mutation resolvers for each table as array
function createMutResolvers(tableName, data) {
	const mutResolvers = [];
	let resolveStr = Generator.createColumn(tableName, data);
		mutResolvers.push(resolveStr);
	return mutResolvers;
}

// returns update mutation resolvers for each table as array
function updateMutResolvers(tableName, data, obj) {
	const mutResolvers = [];
	const { primaryKey } = data;
	let displaySet = '';
	for (let key in obj) displaySet += `${obj[key]}=$${key} `;
	let resolveStr = Generator.updateColumn(tableName, primaryKey, obj, displaySet);
  mutResolvers.push(resolveStr);
	return mutResolvers;
}

// returns delete mutation resolvers for each table as array
function deleteMutResolvers(tableName, data) {
	let mutResolvers = [];
	const { primaryKey } = data;
	resolveStr = Generator.deleteColumn(tableName, primaryKey);
	mutResolvers.push(resolveStr);
  return mutResolvers;
}

// formats and returns mutation resolvers in SDL as single string
function assembleMutResolvers(mutations) {
	let resolveStr = '';
	for (i = 0; i < mutations.length; i++) resolveStr += `${mutations[i]}\n`;
	return resolveStr;
}

// formats and returns all resolvers in SDL as single string for rendering on front-end
function formatResolvers(queryResolvers, mutationResolvers) {
	return 'const resolvers = {\n'
		+ '  Query: {'
		+ `    ${queryResolvers}\n`
		+ '  }\n\n'
		+ '  Mutation: {\n'
		+ `    ${mutationResolvers}`
		+ '  }\n'
		+ '}\n'
}

module.exports = {
  generateGetAllQuery,
  generateGetOneQuery,
	generateQueryResolvers,
	generateMutationResolvers,
	formatResolvers
};