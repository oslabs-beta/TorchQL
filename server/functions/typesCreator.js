const { singular } = require("pluralize");
const { capitalize, typeSet } = require('./helperFunctions');

// returns query root types for each table in SDL format as array of strings
const createQuery = (arr) => {
	const allQueries = [];
	// iterates through each data object corresponding to single table in PostgreSQL database
	for ({ tableName } of arr) {
    const nameSingular = singular(tableName);
    let typeStr = `${tableName}:[${capitalize(nameSingular)}!]!`
			+ `\n    ${nameSingular}ByID(${nameSingular}id:ID):${capitalize(nameSingular)}!`;
		allQueries.push(typeStr);
	};
  return allQueries;
}

// returns create, update, and deletion mutation root types for each table in SDL format as array of strings
const createMutation = (arr) => {
	const allMutations = [];
	// iterates through each data object corresponding to single table in PostgreSQL database
	for ({ tableName, primaryKey, foreignKeys, columns } of arr) {
		// stores foreign keys and associated properties as an object
		const fkCache = {};
		for (key of foreignKeys){
			fkCache[key.name] = key;
		}
		const tableNameSingular = singular(tableName);
		// adds create mutation types to string
		let typeStr = `create${capitalize(tableNameSingular)}(`;
		for (column of columns) {
			if (!fkCache[column.columnName] && column.columnName !== primaryKey) {
				if (typeStr[typeStr.length -1] !== '(') typeStr += ', ';
				typeStr += `${column.columnName}: ${typeSet(column.dataType)}`;
				if (column.isNullable !== "YES") typeStr += '!';
			}
		};
		// adds update mutation types to array of string
		typeStr += `): ${capitalize(tableNameSingular)}!` +
			`\n    update${capitalize(tableNameSingular)}(` +
			`${primaryKey}: ID!`;
		for (column of columns) {
			if (!fkCache[column.columnName] && column.columnName !== primaryKey) {
				typeStr += ', ' + `${column.columnName}: ${typeSet(column.dataType)}`;
				if (column.isNullable !== "YES") typeStr += '!';
			}
		};
		// adds delete mutation types to array of string
		typeStr += `): ${capitalize(tableNameSingular)}!` +
			`\n    delete${capitalize(tableNameSingular)}(` +
			`${primaryKey}: ID!` +
			`): ${capitalize(tableNameSingular)}!`;
		allMutations.push(typeStr);
	};
	return allMutations;
}

// returns object types for each table in SDL format as array of strings
const createTypes = (arr) => {
	const allTypes = [];
	// iterates through each data object corresponding to single table in PostgreSQL database
  for({ tableName, primaryKey, foreignKeys, columns } of arr) {
	// stores foreign keys and associated properties as an object
    const fkCache = {};
    for (let key of foreignKeys) fkCache[key.name] = key;
    let typeStr = `\ntype ${capitalize(singular(tableName))} {\n  ${primaryKey}:ID!`;
    // adds all columns with types to string
    for (column of columns) {
    // adds foreign keys with object type to string
      if (fkCache[column.columnName]) {
        const { name, referenceTable, referenceKey } = fkCache[column.columnName];
        // supposed to check here for one-to-many relationship before displaying type as an array
        // if (refsMany(fkCache[column.columnName])) typeStr += `\n  ${name}:[${capitalize(referenceTable)}]`;
        typeStr += `\n  ${name}:${capitalize(singular(referenceTable))}`;
      // adds remaining columns with types to string
      } else if (column.columnName !== primaryKey) {
        typeStr += `\n  ${column.columnName}:${typeSet(column.dataType)}`;
        if (column.isNullable === 'YES') typeStr += '!';
      }
    }
		typeStr += '\n}';
		allTypes.push(typeStr);
  }
  return allTypes;
}

// formats and returns queries, mutations, and object types in SDL as single string for rendering on front-end
const formatTypeDefs = (arr1, arr2, arr3) => {
	return `const typeDefs = \`\n  type Query {\n    ${arr1.join('\n    ')}}\n
  type Mutation {\n    ${arr2.join('\n    ')}\n  }

		${arr3.join('\n')} \n\n\`;\n\nmodule.exports = typeDefs;
  `;
}

module.exports = {
		createQuery,
		createMutation,
		createTypes,
		formatTypeDefs
};