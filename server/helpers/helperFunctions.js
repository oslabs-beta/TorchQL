const { singular } = require('pluralize');

function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
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
    const refTableType = capitalize(singular(refTableName));
    if (foreignRefBy && foreignRefBy[tableName]) relationships += `\n    ${reftableName}: [${refTableType}]`;
    else relationships += `\n    ${refTableName}: [${refTableType}]`;
    for (let foreignTableFKey in foreignTableFKeys) {
      if (tableName !== foreignTableFKeys[foreignTableFKey].referenceTable) {
        const manyToManyTable = foreignTableFKeys[foreignTableFKey].referenceTable;
        relationships += `\n    ${manyToManyTable}: [${capitalize(singular(manyToManyTable))}]`;
      }
    }
  }
  return relationships;
}

module.exports = {
	capitalize,
	typeSet,
	storeForeignKeys,
	storeIndexedColumns,
	getRelationships
};