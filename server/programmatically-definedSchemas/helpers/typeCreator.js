const TypeGenerator = require('../generators/typeGenerator');
const {
  storeIndexedColumns,
  getPrimaryKeyType,
} = require('../helpers/helperFunctions');

function generateCustomTypes(data) {
  const allTypes = [];
  const tables = Object.keys(data);
  for (const tableName of tables) {
    const { foreignKeys, columns } = data[tableName];
    if (foreignKeys === null || Object.keys(columns).length !== Object.keys(foreignKeys).length + 1) {
      allTypes.push(TypeGenerator.createTypes(tableName, data));
    }
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
  generateCustomTypes,
  assembleTypes
}