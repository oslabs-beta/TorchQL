const { singular } = require("pluralize");
const { capitalize, createValuesArray } = require('./helperFunctions');

// returns get all query resolvers for each table in SDL format as array of strings
const generateGetAllQuery = (data) => {
	const queriesAll = [];
	// iterates through each data object corresponding to single table in PostgreSQL database
	const tables = Object.keys(data);
	for (tableName of tables) {
		let resolveStr = 
		`${tableName}: () => {\n      try {\n        const query = 'SELECT * FROM ${tableName}';\n        return db.query(query).then((res) => res.rows)\n      } catch (err) {\n        throw new Error(err);\n      }\n    }`;
	queriesAll.push(resolveStr);
	}
	return queriesAll;
};

// returns get one query resolvers for each table in SDL format as array of strings
const generateGetOneQuery = (data) => {
	const queriesById = [];
	// iterates through each data object corresponding to single table in PostgreSQL database
	const tables = Object.keys(data);
	for (tableName of tables) {
		const { primaryKey } = data[tableName];
	let resolveStr = `${singular(tableName)}ById: (parent, args) => {\n      try{\n        const query = 'SELECT * FROM ${tableName} WHERE ${primaryKey} = $1';\n        const values = [args.${primaryKey}]\n        return db.query(query).then((res) => res.rows)\n      } catch (err) {\n        throw new Error(err);\n      }\n    }`;
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
const generateMutationResolvers = (data) => {
	const allMutResolvers = [];
	const tables = Object.keys(data);
	for (let i = 0; i < tables.length; i++) {
		const tableName = tables[i]
		const { primaryKey, foreignKeys, columns } = data[tableName];
		let fkCache = {};
		const fKeys = (foreignKeys === null) ? [] : Object.keys(foreignKeys);
		for (key of fKeys) fkCache[key] = foreignKeys[key];
		let valueObj = {};
		let valueIndex = 1;
		const columnNames = Object.keys(columns);
		for (columnName of columnNames) {
			if (!fkCache[columnName] && columnName !== primaryKey) {
				valueObj[valueIndex++] = columnName;
			}
		}
		// skip tables with all columns with only primary and foreign keys
		if (valueIndex === 1) continue;
		allMutResolvers.push(createMutResolvers(tableName, data[tableName], valueObj));
		allMutResolvers.push(updateMutResolvers(tableName, data[tableName], valueObj, valueIndex));
		allMutResolvers.push(deleteMutResolvers(tableName, data[tableName]));
	}
	return assembleMutResolvers(allMutResolvers);
};

// returns create mutation resolvers for each table as array
const createMutResolvers = (tableName, obj, valueObj) => {
	const mutResolvers = [];
	// stores foreign keys and associated properties as an object
	let resolveStr = `create${capitalize(singular(tableName))}: () => {\n    const query = 'INSERT INTO ${tableName}(`;
  resolveStr += `${Object.values(valueObj)}`;
	resolveStr += `) VALUES(${Object.keys(valueObj).map(x => `$${x}`)})';\n    const values = [${Object.values(valueObj).map(x => `args.${x}`)}]\n    try {\n      return db.query(query, values);\n    } catch (err) {\n      throw new Error(err);\n    }\n  }`;
		mutResolvers.push(resolveStr);
	return mutResolvers;
}

// returns update mutation resolvers for each table as array
const updateMutResolvers = (tableName, obj, valueObj, valueIndex) => {
	const mutResolvers = [];
	const { primaryKey } = obj;
		// stores foreign keys and associated properties as an object
		// if (valueIndex === 1) continue;
	let displaySet = '';
	for (let key in valueObj) {
		displaySet += `${valueObj[key]}=$${key} `;
	}
	let resolveStr = `update${capitalize(singular(tableName))}: (parent, args => {\n    try {\n      const query = 'UPDATE ${tableName} SET ${displaySet} WHERE ${primaryKey} = $${valueIndex}';\n      const values = [${Object.values(valueObj).map(x => `args.${x}`)}, args.${primaryKey}]\n      return db.query(query).then((res) => res.rows)\n    } catch (err) {\n      throw new Error(err);\n    }\n  }`;
  mutResolvers.push(resolveStr);
	return mutResolvers;
}

// returns delete mutation resolvers for each table as array
const deleteMutResolvers = (tableName, obj) => {
	let mutResolvers = [];
	const { primaryKey } = obj;
	resolveStr = `delete${capitalize(singular(tableName))}: (parent, args) => {\n    try {\n      const query = 'DELETE FROM ${tableName} WHERE ${primaryKey} = $1';\n      const values = [args.${primaryKey}]\n      return db.query(query).then((res) => res.rows)\n    } catch (err) {\n      throw new Error(err);\n    }\n  }`;
	mutResolvers.push(resolveStr);
  return mutResolvers;
}

// formats and returns mutation resolvers in SDL as single string
const assembleMutResolvers = (arr) => {
	let resolveStr = '';
	for (i = 0; i < arr.length; i++) {
		resolveStr += `  ${arr[i]}\n`;
	}
	resolveStr += '}';
	return resolveStr;
};

// formats and returns all resolvers in SDL as single string for rendering on front-end
const formatResolvers = (str1, str2) => {
	let resolveStr = `const resolvers = {\n  Query: {`;
	resolveStr += str1;
	resolveStr += `\n\nMutation: {\n`;
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