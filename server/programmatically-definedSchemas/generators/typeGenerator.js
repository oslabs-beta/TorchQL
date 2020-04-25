const { singular } = require('pluralize');
const { capitalize } = require('../../SDL-definedSchemas/helpers/helperFunctions');
const { getDataType, getValsAndTypes } = require('../helpers/helperFunctions');
const { toCamelCase, toPascalCase } = require('../../SDL-definedSchemas/helpers/helperFunctions');

const TypeGenerator = {};

TypeGenerator.createCustomTypes = function createCustomTypes(tableName, tables) {
  const { primaryKey, foreignKeys, columns } = tables[tableName];
  return `const ${capitalize(singular(tableName))}Type = new GraphQLObjectType({\n`
    + `  name: '${capitalize(singular(tableName))}',\n`
    + `  fields: () => ({\n`
    + `    ${toCamelCase(primaryKey)}: { type: GraphQLString },`
    + this._columns(primaryKey, foreignKeys, columns)
    // + this._getRelationships(tableName, tables)
    + '\n  }),\n});\n';

};

TypeGenerator._columns = function columns(primaryKey, foreignKeys, columns) {
  let colStr = '';
  for (let columnName in columns) {
    if (!(foreignKeys && foreignKeys[columnName]) && columnName !== primaryKey) {
      const { dataType, isNullable } = columns[columnName];
      colStr += `\n    ${toCamelCase(columnName)}: { type: ${getDataType(dataType)} },`;
    }
  }
  return colStr;
};

module.exports = TypeGenerator;