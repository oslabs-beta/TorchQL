const TypeGenerator = require('../generators/typeGenerator');
const {
  storeIndexedColumns,
  getPrimaryKeyType,
} = require('../helpers/helperFunctions');

function generateTypes(data) {
  const allTypes = [];
  const tables = Object.keys(data);
  for (const tableName of tables) {
    const { primaryKey, columns } = data[tableName];
    const valueObj = storeIndexedColumns(columns, primaryKey);
    const primaryKeyType = getPrimaryKeyType(primaryKey, columns);
    // need to add code to skip columns with only primary and foreign keys?
    allTypes.push(TypeGenerator.createTypes(tableName, data));
  }
  return allTypes;
}

function assembleTypes(types) {
  let typeString = '';
  for (let i = 0; i < types.length; i++) {
    typeString += `${types[i]}\n`;
  }
  return typeString;
}

module.exports = {
  generateTypes,
  assembleTypes
}