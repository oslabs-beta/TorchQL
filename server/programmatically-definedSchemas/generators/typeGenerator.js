const { singular } = require('pluralize');
const { capitalize } = require('../../SDL-definedSchemas/helpers/helperFunctions');
const { getDataType } = require('../helpers/helperFunctions');
const { toCamelCase, toPascalCase } = require('../../SDL-definedSchemas/helpers/helperFunctions');

const TypeGenerator = {};

TypeGenerator.createCustomTypes = function createCustomTypes(tableName, tables) {
  const { primaryKey, foreignKeys, columns } = tables[tableName];
  return `const ${capitalize(singular(tableName))}Type = new GraphQLObjectType({\n`
    + `  name: '${capitalize(singular(tableName))}',\n`
    + `  fields: () => ({\n`
    + `    ${toCamelCase(primaryKey)}: { type: GraphQLString },`
    + this._columns(primaryKey, foreignKeys, columns)
    + this._getRelationships(tableName, tables)
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

TypeGenerator._getRelationships = function getRelationships(tableName, tables) {
  let relationships = '';
  for (let refTableName in tables[tableName].referencedBy) {
    const { referencedBy: foreignRefBy, foreignKeys: foreignFKeys, columns: foreignColumns } = tables[refTableName];
    const { primaryKey } = tables[refTableName];
    const refTableType = toPascalCase(singular(refTableName));
    relationships += `\n${this._columnQuery(refTableName, primaryKey)}`;
  }
  return relationships;
};

TypeGenerator._columnQuery = function column(tableName, primaryKey) {
  let byID = toCamelCase(singular(tableName));
  if (byID === toCamelCase(tableName)) byID += 'ByID';
  return `    ${byID}: {\n`
    + `      type: ${capitalize(singular(tableName))}Type,\n`
    + `      resolve(parent, args) => {\n`
    + '        try{\n'
    + `          const query = 'SELECT * FROM ${tableName} WHERE ${primaryKey} = $1';\n`
    + `          const values = [args.${primaryKey}]\n`
    + '          return db.query(query).then((res) => res.rows)\n'
    + '        } catch (err) {\n'
    + '          throw new Error(err);\n'
    + '        }\n'
    + '      },';
};

module.exports = TypeGenerator;