const { singular } = require('pluralize');
const { capitalize, typeSet } = require('./../helpers/helperFunctions');

const TypeGenerator = {};

TypeGenerator.get = () => {

};

TypeGenerator.create = (table, primaryKey, foreignKeys, columns) => {
  let typeDef = `create${capitalize(singular(table))}(`;
  const columnNames = Object.keys(columns);
  for (let j = 0; j < columnNames.length; j++) {
    const { dataType, isNullable } = columns[columnNames[j]];
    if (foreignKeys === null || !foreignKeys[columnNames[j]] && columnNames[j] !== primaryKey) {
      if (typeDef[typeDef.length - 1] !== '(') typeDef += ', ';
      typeDef += `\n  ${columnNames[j]}: ${typeSet(dataType)}`;
      if (isNullable !== 'YES') typeDef += '!';
    }
  }
  return typeDef;
};

TypeGenerator.update = (table, primaryKey, foreignKeys, columns) => {
  let typeDef = `): ${capitalize(singular(table))}!\n    update${capitalize(singular(table))}(${primaryKey}: ID!`;
  const columnNames = Object.keys(columns);
  for (let j = 0; j < columnNames.length; j++) {
    const { dataType, isNullable } = columns[columnNames[j]];
    if (foreignKeys === null || !foreignKeys[columnNames[j]] && columnNames[j] !== primaryKey) {
      typeDef += `, ${columnNames[j]}: ${typeSet(dataType)}`;
      if (isNullable !== 'YES') typeDef += '!';
    }
  }
  return typeDef;
};

TypeGenerator.delete = (table, primaryKey) => {
  `): ${capitalize(singular(table))}!\n`
    + `    delete${capitalize(singular(table))}(${primaryKey}: ID!): ${capitalize(singular(table))}!`;
};

module.exports = TypeGenerator;