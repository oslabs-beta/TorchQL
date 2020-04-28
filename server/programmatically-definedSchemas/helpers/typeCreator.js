const TypeGenerator = require('../generators/typeGenerator');

function generateCustomTypes(data) {
  const allTypes = [];
  const tables = Object.keys(data);
  for (const tableName of tables) {
    const { foreignKeys, columns } = data[tableName];
    allTypes.push(TypeGenerator.createCustomTypes(tableName, data));
  }
  return allTypes;
}

function assembleCustomTypes(types) {
  let typeString = '';
  for (let i = 0; i < types.length; i++) {
    typeString += `${types[i]}\n`;
  }
  return typeString;
}

module.exports = {
  generateCustomTypes,
  assembleCustomTypes
}