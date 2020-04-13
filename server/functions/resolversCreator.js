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
	const createMutResolvers = [];
	const updateMutResolvers = [];
	const deleteMutResolvers = [];
	for ({ tableName, primaryKey, foreignKeys, columns } of arr) {
    // stores foreign keys and associated properties as an object
		let fkCache = {};
		let resolveStr = '';
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
		if (valueIndex === 1) continue;
		console.log('valueObj', valueObj)
		resolveStr += `\ncreate${capitalize(singular(tableName))}: () => {
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
		createMutResolvers.push(resolveStr);
		let displaySet = '';
		for (let key in valueObj) {
			displaySet += `${valueObj[key]}=$${key} `;
		}
		console.log('hey')
		resolveStr = `\nupdate${capitalize(singular(tableName))}: (parent, args => {
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
	updateMutResolvers.push(resolveStr);
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
 deleteMutResolvers.push(resolveStr);
	}
	console.log('fake')
	return assembleMutResolvers(createMutResolvers, updateMutResolvers, deleteMutResolvers);
};

// formats and returns mutation resolvers in SDL as single string
const assembleMutResolvers = (arr1, arr2, arr3) => {
	let resolveStr = `\nMutation: {`;
	for (i = 0; i < arr1.length; i++) {
		resolveStr += `\n    ${arr1[i]}\n    ${arr2[i]}\n    ${arr3[i]}`;
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