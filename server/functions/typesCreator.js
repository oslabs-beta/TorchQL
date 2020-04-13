const { singular } = require("pluralize");
const { capitalize, typeSet } = require('./helperFunctions');

// returns query root types for each table in SDL format as array of strings
const createQuery = (data) => {
	const allQueries = [];
  const tables = Object.keys(data);
	// iterates through each data object corresponding to single table in PostgreSQL database
	for (tableName of tables) {
    const nameSingular = singular(tableName);
    let typeStr = `${tableName}:[${capitalize(nameSingular)}!]!`
			+ `\n  ${nameSingular}ByID(${nameSingular}id:ID):${capitalize(nameSingular)}!`;
		allQueries.push(typeStr);
	};
  return allQueries;
}

// returns create, update, and deletion mutation root types for each table in SDL format as array of strings
const createMutation = (data) => {
	const allMutations = [];
  const tables = Object.keys(data);
	// iterates through each data object corresponding to single table in PostgreSQL database
	for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const { primaryKey, foreignKeys, columns } = data[table];
		// stores foreign keys and associated properties as an object
		const fkCache = {};
    const fKeys = (foreignKeys === null) ? [] : Object.keys(foreignKeys);
		for (key of fKeys) fkCache[key] = foreignKeys[key];
		const tableNameSingular = singular(table);
		// adds create mutation types to string
		let typeStr = `create${capitalize(tableNameSingular)}(`;
    const columnNames = Object.keys(columns);
		for (let j = 0; j < columnNames.length; j++) {
      const { dataType, isNullable } = columns[columnNames[j]];
			if (!fkCache[columnNames[j]] && columnNames[j] !== primaryKey) {
				if (typeStr[typeStr.length -1] !== '(') typeStr += ', ';
				typeStr += `${columnNames[j]}: ${typeSet(dataType)}`;
				if (isNullable !== 'YES') typeStr += '!';
			}
		};
		// adds update mutation types to array of string
		typeStr += `): ${capitalize(tableNameSingular)}!` +
			`\n    update${capitalize(tableNameSingular)}(` + `${primaryKey}: ID!`;
		for (let j = 0; j < columnNames.length; j++) {
      const { dataType, isNullable } = columns[columnNames[j]];
			if (!fkCache[columnNames[j]] && columnNames[j] !== primaryKey) {
				typeStr += ', ' + `${columnNames[j]}: ${typeSet(dataType)}`;
				if (isNullable !== 'YES') typeStr += '!';
			}
		};
		// adds delete mutation types to array of string
		typeStr += `): ${capitalize(tableNameSingular)}!` +
			`\n    delete${capitalize(tableNameSingular)}(${primaryKey}: ID!): ${capitalize(tableNameSingular)}!`;
		allMutations.push(typeStr);
	};
	return allMutations;
}

// returns object types for each table in SDL format as array of strings
const createTypes = (data) => {
	const allTypes = [];
  const tables = Object.keys(data);
	// iterates through each data object corresponding to single table in PostgreSQL database
  for(let i = 0; i < tables.length; i++) {
    const tableName = tables[i];
    const { primaryKey, foreignKeys, columns } = data[tableName];
  	// stores foreign keys and associated properties as an object
    const fkCache = {};
    const fKeys = (foreignKeys === null) ? [] : Object.keys(foreignKeys);
    for (let key of fKeys) fkCache[key] = foreignKeys[key];
    let typeStr = `\ntype ${capitalize(singular(tableName))} {\n  ${primaryKey}:ID!`;
    // adds all columns with types to string
    const columnNames = Object.keys(columns);
    for (columnName of columnNames) {
      const { dataType, isNullable } = columns[columnName];
      // adds foreign keys with object type to string
      if (fkCache[columnName]) {
        const { name, referenceTable, referenceKey } = fkCache[columnName];
        // supposed to check here for one-to-many relationship before displaying type as an array
        // if (refsMany(fkCache[columnName])) typeStr += `\n  ${name}:[${capitalize(referenceTable)}]`;
        typeStr += `\n  ${name}:${capitalize(singular(referenceTable))}`;
      // adds remaining columns with types to string
      } else if (columnName !== primaryKey) {
        typeStr += `\n  ${columnName}:${typeSet(dataType)}`;
        if (isNullable === 'YES') typeStr += '!';
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
