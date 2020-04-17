const { singular } = require('pluralize');
const { capitalize, typeSet } = require('./../helpers/helperFunctions');

const TypeGenerator = {};

TypeGenerator.get = () => {

};

TypeGenerator.create = function create(table, primaryKey, foreignKeys, columns) {
  return `create${capitalize(singular(table))}(`
    + this.typeParams(primaryKey, foreignKeys, columns)
    + `): ${capitalize(singular(table))}!\n`;
};

TypeGenerator.update = function update(table, primaryKey, foreignKeys, columns) {
  return `    update${capitalize(singular(table))}(`
    + this.typeParams(primaryKey, foreignKeys, columns)
    + `): ${capitalize(singular(table))}!\n`;
};

TypeGenerator.destroy = function destroy(table, primaryKey) {
  return `    delete${capitalize(singular(table))}(${primaryKey}: ID!): ${capitalize(singular(table))}!`;
};

TypeGenerator.typeParams = function addParams(primaryKey, foreignKeys, columns) {
  let typeDef = '';
  const columnNames = Object.keys(columns);
  for (let j = 0; j < columnNames.length; j++) {
    const { dataType, isNullable } = columns[columnNames[j]];
    if (foreignKeys === null || !foreignKeys[columnNames[j]] && columnNames[j] !== primaryKey) {
      if (typeDef === '') typeDef += '\n';
      typeDef += `      ${columnNames[j]}: ${typeSet(dataType)}`;
      if (isNullable !== 'YES') typeDef += '!';
      typeDef += ',\n';
    }
  }
  if (typeDef !== '') typeDef += '    ';
  return typeDef;
}

module.exports = TypeGenerator;