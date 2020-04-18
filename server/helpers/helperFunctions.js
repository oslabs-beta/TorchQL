const { singular } = require('pluralize');

function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function toCamelCase(str) {
  let varName = str.toLowerCase();
  for (let i = 0, len = varName.length; i < len; i++) {
    const isSeparator = varName[i] === '-' || varName[i] === '_';
    if (varName[i + 1] && isSeparator) {
      const char = (i === 0) ? varName[i + 1] : varName[i + 1].toUpperCase();
      varName = varName.slice(0, i) + char + varName.slice(i + 2);
    } else if (isSeparator) {
      varName = varName.slice(0, i);
    }
  }
  return varName;
}
  
function typeSet(str) {
	switch (str) {
		case 'character varying':
			return 'String';
			break;
		case 'character':
			return 'String';
			break;
		case 'integer':
			return 'Int';
			break;
		case 'text':
			return 'String';
			break;
		case 'date':
			return 'String';
			break;
		case 'boolean':
			return 'Boolean';
			break;
		default: 
			return 'Int';
	}
}

function storeForeignKeys(obj) {
  const cache = {};
  const fKeys = (obj === null) ? [] : Object.keys(obj);
	for (key of fKeys) cache[key] = obj[key];
	return cache;
}

function storeIndexedColumns(obj, key, cache) {
	let newObj = {};
	let index = 1;
	const columnNames = Object.keys(obj);
	for (columnName of columnNames) {
		if (!cache[columnName] && columnName !== key) {
			newObj[index++] = columnName;
		}
	}
	return newObj;
}
  
// Get table relationships
function getRelationships(data, tableName, referencedBy) {
  let relationships = '';
  for (let refTableName in referencedBy) {
    const { referencedBy: foreignRefBy, foreignKeys: foreignTableFKeys } = data[refTableName];
    const refTableType = toCamelCase(capitalize(singular(refTableName)));
    if (foreignRefBy && foreignRefBy[tableName]) relationships += `\n    ${reftableName}: [${refTableType}]`;
    else relationships += `\n    ${toCamelCase(refTableName)}: [${refTableType}]`;
    for (let foreignTableFKey in foreignTableFKeys) {
      if (tableName !== foreignTableFKeys[foreignTableFKey].referenceTable) {
        const manyToManyTable = toCamelCase(foreignTableFKeys[foreignTableFKey].referenceTable);
        relationships += `\n    ${manyToManyTable}: [${capitalize(singular(manyToManyTable))}]`;
      }
    }
  }
  return relationships;
}

module.exports = {
	capitalize,
  toCamelCase,
	typeSet,
	storeForeignKeys,
	storeIndexedColumns,
	getRelationships
};