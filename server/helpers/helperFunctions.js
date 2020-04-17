

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
	const refTableNames = (referencedBy === null) ? [] : Object.keys(referencedBy);
  for (let refTableName of refTableNames) {
    let isOneToOne;
    const foreignTableData = data[refTableName];
    if (foreignTableData.referencedBy && foreignTableData.referencedBy[tableName]) isOneToOne =  true;
    else isOneToOne = false;
    if (isOneToOne) console.log(tableName, ' <---------------------> ', refTableName);
    else console.log(tableName, ' ----------<========== ', refTableName);
    const { foreignKeys: foreignTableFKeys } = data[refTableName];
    for (let foreignTableFKey in foreignTableFKeys) {
      if (tableName !== foreignTableFKeys[foreignTableFKey].referenceTable)
      console.log(tableName, `--< ${refTableName} >--`, foreignTableFKeys[foreignTableFKey].referenceTable);
    }
  }
  console.log('')
}

module.exports = {
	capitalize,
	typeSet,
	storeForeignKeys,
	storeIndexedColumns,
	getRelationships
};