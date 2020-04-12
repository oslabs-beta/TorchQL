const { singular } = require("pluralize");
const { capitalize, typeSet } = require('./helperFunctions');

// returns query types in SDL as string
const createQuery = (arr) => {
	const allQueries = [];
	for ({ tableName } of arr) {
    const nameSingular = singular(tableName);
    let typeStr = `${tableName}:[${capitalize(nameSingular)}!]!`
			+ `\n    ${nameSingular}ByID(${nameSingular}id:ID):${capitalize(nameSingular)}!`;
		allQueries.push(typeStr);
	};
  return allQueries;
}

// returns mutation types in SDL as string
const createMutation = (arr) => {
	const allMutations = [];
	for ({ tableName, primaryKey, foreignKeys, columns } of arr) {
		let fkCache = {};
		for (key of foreignKeys){
			fkCache[key.name] = key;
		}
		let tableNameSingular = singular(tableName);
		// adds create mutation types in SDL as string
		let typeStr = `create${capitalize(tableNameSingular)}(`;
		for (column of columns) {
			if (!fkCache[column.columnName] && column.columnName !== primaryKey) {
				if (typeStr[typeStr.length -1] !== '(') typeStr += ', ';
				typeStr += `${column.columnName}: ${typeSet(column.dataType)}`;
				if (column.isNullable !== "YES") {
					typeStr += '!';
				}
			}
		};
		typeStr += `): ${capitalize(tableNameSingular)}!`;
		// adds update mutation types in SDL as string
		typeStr += `\n    update${capitalize(tableNameSingular)}(`;
		typeStr += `${primaryKey}: ID!`
		for (column of columns) {
			if (!fkCache[column.columnName] && column.columnName !== primaryKey) {
				typeStr += ', ';
				typeStr += `${column.columnName}: ${typeSet(column.dataType)}`;
				if (column.isNullable !== "YES") {
					typeStr += '!';
				}
			}
		};
		typeStr += `): ${capitalize(tableNameSingular)}!`;
		// adds delete mutation types in SDL as string
		typeStr += `\n    delete${capitalize(tableNameSingular)}(`;
		typeStr += `${primaryKey}: ID!`;
		typeStr += `): ${capitalize(tableNameSingular)}!`;
		allMutations.push(typeStr);
	};
	return allMutations;
}

// returns custom objects types in SDL as string
const createTypes = (arr) => {
	const allTypes = [];
  for({ tableName, primaryKey, foreignKeys, columns } of arr) {
    const fkCache = {};
    for (let key of foreignKeys) fkCache[key.name] = key;
    let typeStr = `\ntype ${capitalize(singular(tableName))} {\n  ${primaryKey}:ID!`;
    // adds all columns with types to SDL string
    for (column of columns) {
    // adds foreign keys with object type to SDL string
      if (fkCache[column.columnName]) {
        const { name, referenceTable, referenceKey } = fkCache[column.columnName];
        // supposed to check for one-to-many relationship before displaying type as array
        // if (refsMany(fkCache[column.columnName])) typeStr += `\n  ${name}:[${capitalize(referenceTable)}]`;
        typeStr += `\n  ${name}:${capitalize(singular(referenceTable))}`;
      // adds remaining columns with types to SDL string
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

// returns queries, mutations, and object types formatted for sending back to front-end
const formatTypeDefs = (arr1, arr2, arr3) => {
	return `const typeDefs = \`\n  type Query {\n    ${arr1.join('\n    ')}}
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