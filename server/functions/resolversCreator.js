const { singular } = require("pluralize");

// returns get all query resolvers for each table in SDL format as array of strings
const generateGetAllQuery = (arr) => {
	const queriesAll = [];
	// iterates through each data object corresponding to single table in PostgreSQL database
	for ({ tableName } of arr) {
		let resolveStr = 
		`${tableName}: () => {
		try{
			const query = 'SELECT * FROM ${tableName}';
			return db.query(query).then((res) => res.rows)
		} catch (err) {
			throw new Error(err);
		}
	}
		`;
	queriesAll.push(resolveStr);
	}
	return queriesAll;
};

// returns get one query resolvers for each table in SDL format as array of strings
const generateGetOneQuery = (arr) => {
	const queriesById = [];
	// iterates through each data object corresponding to single table in PostgreSQL database
	for ({ tableName, primaryKey } of arr) {
	let resolveStr = `${singular(tableName)}ById: (parent, args) => {
		try{
			const query = 'SELECT * FROM ${tableName} WHERE ${primaryKey} = $1';
			const values = [args.${primaryKey}]
			return db.query(query).then((res) => res.rows)
		} catch (err) {
			throw new Error(err);
		}
	}
	`;
	queriesById.push(resolveStr);
	}
	return queriesById;
};

// formats and returns query resolvers arranged by table in SDL as single string 
const generateQueryResolvers = (arr1, arr2) => {
	let resolveStr = '';
	for (i = 0; i < arr1.length; i++) {
		resolveStr += `\n    ${arr1[i]}\n    ${arr2[i]}`;
	}
	resolveStr += '}';
	return resolveStr;
};

// formats and returns mutation resolvers arranged by table in SDL as single string 
const generateMutationResolvers = (arr1, arr2) => {

};

// formats and returns resolvers in SDL as single string for rendering on front-end
const formatResolvers = (str1, str2) => {
	let resolveStr = `const resolvers = {\n\xa0\xa0Query: {`;
	resolveStr += str1;
	resolveStr += str2;
	return resolveStr;
}

module.exports = {
  generateGetAllQuery,
  generateGetOneQuery,
  generateQueryResolvers
};