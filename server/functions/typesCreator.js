const { singular } = require("pluralize");
const { capitalize, typeSet } = require('./helperFunctions');

// returns query types in SDL as string
function createQuery(arr) {
  let typeStr = '';
  arr.forEach(({ tableName }) => {
    const nameSingular = singular(tableName);
    typeStr += `\n${tableName}:[${capitalize(nameSingular)}!]!`
      + `\n${nameSingular}ByID(${nameSingular}id:ID):${capitalize(nameSingular)}!`;
	});
  return typeStr;
}

// returns mutation types in SDL as string
function createMutation(arr) {
	let typeStr = '';
	for({ tableName, primaryKey, foreignKeys, columns } of arr) {
		let fkCache = {};
		for (key of foreignKeys){
			fkCache[key.name] = key;
		}
		let tableNameSingular = singular(tableName);
		// adds create mutation types in SDL as string
		typeStr += `\n\ncreate${capitalize(tableNameSingular)}(`;
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
		typeStr += `\n\nupdate${capitalize(tableNameSingular)}(`;
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
		typeStr += `\n\ndelete${capitalize(tableNameSingular)}(`;
		typeStr += `${primaryKey}: ID!`;
		typeStr += `): ${capitalize(tableNameSingular)}!`;
	};
	return typeStr;
}

// returns custom objects types in SDL as string
function createTypes(arr) {
	let typeStr = '';
  for({ tableName, primaryKey, foreignKeys, columns } of arr) {
    const fkCache = {};
    for (let key of foreignKeys) fkCache[key.name] = key;
    typeStr += `\ntype ${capitalize(singular(tableName))} {\n  ${primaryKey}:ID!`;
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
  }
  return typeStr;
}

// returns queries, mutations, and object types formatted for sending back to front-end
function formatTypeDefs(str1, str2, str3) {
  return `
  const typeDefs = \`
    type Query { ${str1}
    }

    type Mutation { ${str2}
    }

      ${str3}\`
  

  module.exports = typeDefs;
  `;
}

module.exports = {
		createQuery,
		createMutation,
		createTypes,
		formatTypeDefs
};