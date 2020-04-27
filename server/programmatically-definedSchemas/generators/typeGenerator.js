const { singular } = require('pluralize');
const { getDataType } = require('../helpers/helperFunctions');
const { toCamelCase, toPascalCase, getPrimaryKeyType } = require('../helpers/helperFunctions');

const TypeGenerator = {};

TypeGenerator.createCustomTypes = function createCustomTypes(tableName, tables) {
  const { primaryKey, foreignKeys, columns } = tables[tableName];
  const singleName = singular(tableName);
  return `const ${toPascalCase(singleName)}Type = new GraphQLObjectType({\n`
    + `  name: '${toPascalCase(singleName)}',\n`
    + `  fields: () => ({\n`
    + `    ${toCamelCase(primaryKey)}: { type: ${getDataType(getPrimaryKeyType(primaryKey, columns))} },`
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
    const { primaryKey } = tables[refTableName];
    relationships += `\n${this._columnQuery(refTableName, primaryKey)}`;
  }
  return relationships;
};

TypeGenerator._columnQuery = function column(tableName, primaryKey) {
  const singleName = singular(tableName);
  // if (byID === toCamelCase(singleName)) byID += 'ByID';
  return `    ${toCamelCase(singleName)}: {\n`
    + `      type: ${toPascalCase(singleName)}Type,\n`
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