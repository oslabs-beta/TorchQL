const TypeGenerator = require('../generators/typeGenerator');
const {
  storeIndexedColumns,
  getPrimaryKeyType,
} = require('../helpers/helperFunctions');

function generateTypes(data) {
  const allTypes = [];
  const tables = Object.keys(data);
  for (const tableName of tables) {
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