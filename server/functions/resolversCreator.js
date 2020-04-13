const { singular } = require("pluralize");
const { capitalize, createValuesArray } = require('./helperFunctions');

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
const generateMutationResolvers = (arr) => {
	const allMutResolvers = [];
	for ( obj of arr) {
		const { primaryKey, foreignKeys, columns } = obj;
		let fkCache = {};
		for (key of foreignKeys){
			fkCache[key.name] = key;
		}
		let valueObj = {};
		let valueIndex = 1;
		for (column of columns) {
			if (!fkCache[column.columnName] && column.columnName !== primaryKey) {
				valueObj[valueIndex] = column.columnName;
				valueIndex++;
			}
		}
		// skip tables with all columns with only primary and foreign keys
		if (valueIndex === 1) continue;
		allMutResolvers.push(createMutResolvers(obj, valueObj));
		allMutResolvers.push(updateMutResolvers(obj, valueObj, valueIndex));
		allMutResolvers.push(deleteMutResolvers(obj));
	}
	return assembleMutResolvers(allMutResolvers);
};

// returns create mutation resolvers for each table as array
const createMutResolvers = (obj, valueObj) => {
	const mutResolvers = [];
	const { tableName } = obj;
		// stores foreign keys and associated properties as an object
		let resolveStr = `\ncreate${capitalize(singular(tableName))}: () => {
			try{
					const query = 'INSERT INTO ${tableName}(`;
		resolveStr += `${Object.values(valueObj)}`;
		resolveStr += `)
						VALUES(${Object.keys(valueObj)})';
						const values = [${Object.values(valueObj).map(x => `args.${x}`)}]
						return db.query(query, values)
				} catch (err) {
						throw new Error(err);
				}
		}
		`;
		mutResolvers.push(resolveStr);
	return mutResolvers;
}

// returns update mutation resolvers for each table as array
const updateMutResolvers = (obj, valueObj, valueIndex) => {
	const mutResolvers = [];
	const { tableName, primaryKey } = obj;
		// stores foreign keys and associated properties as an object
		// if (valueIndex === 1) continue;
	let displaySet = '';
	for (let key in valueObj) {
		displaySet += `${valueObj[key]}=$${key} `;
	}
	let resolveStr = `\nupdate${capitalize(singular(tableName))}: (parent, args => {
		try{
				const query = 'UPDATE ${tableName} 
				SET ${displaySet}
				WHERE ${primaryKey} = $${valueIndex}';
				const values = [args.${primaryKey}]
				return db.query(query).then((res) => res.rows)
		} catch (err) {
				throw new Error(err);
		}
}
`;
 mutResolvers.push(resolveStr);
	return mutResolvers;
}

// returns delete mutation resolvers for each table as array
const deleteMutResolvers = (obj) => {
	let mutResolvers = [];
	const { tableName, primaryKey } = obj;
	resolveStr = `\ndelete${capitalize(singular(tableName))}: (parent, args) => {
		try{
				const query = 'DELETE FROM ${tableName} 
				WHERE ${primaryKey} = $1';
				const values = [args.${primaryKey}]
				return db.query(query).then((res) => res.rows)
		} catch (err) {
				throw new Error(err);
		}
	}
	`;
	mutResolvers.push(resolveStr);
  return mutResolvers;
}

// formats and returns mutation resolvers in SDL as single string
const assembleMutResolvers = (arr) => {
	let resolveStr = `\nMutation: {`;
	for (i = 0; i < arr.length; i++) {
		resolveStr += `\n    ${arr[i]}\n`;
	}
	resolveStr += '}';
	return resolveStr;
};

// formats and returns all resolvers in SDL as single string for rendering on front-end
const formatResolvers = (str1, str2) => {
	let resolveStr = `const resolvers = {\n  Query: {`;
	resolveStr += str1;
	resolveStr += str2;
	return resolveStr;
}

module.exports = {
  generateGetAllQuery,
  generateGetOneQuery,
	generateQueryResolvers,
	generateMutationResolvers,
	formatResolvers
};