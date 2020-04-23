const { singular } = require('pluralize');
const { capitalize, toCamelCase, typeSet } = require('./../helpers/helperFunctions');

const TypeGenerator = {};

TypeGenerator.queries = function queries(tableName) {
  const nameSingular = singular(tableName);
  const camSinName = toCamelCase(nameSingular);
  return `    ${toCamelCase(tableName)}:[${capitalize(camSinName)}!]!\n`
    + `    ${camSinName}ByID(${camSinName}id:ID):${camSinName}!\n`;
};

TypeGenerator.mutations = function mutations(tableName, tableData) {
  const { primaryKey, foreignKeys, columns } = tableData;
  return this._create(tableName, primaryKey, foreignKeys, columns)
    + this._update(tableName, primaryKey, foreignKeys, columns)
    + this._destroy(tableName, primaryKey);
};

TypeGenerator.customTypes = function customTypes(tableName, tables) {
  const { primaryKey, foreignKeys, columns } = tables[tableName];
  if (foreignKeys === null || Object.keys(columns).length !== Object.keys(foreignKeys).length + 1) {
    return `  type ${toCamelCase(singular(tableName))} {\n`
      + `    ${toCamelCase(primaryKey)}: ID!`
      + this._columns(primaryKey, foreignKeys, columns)
      + this._getRelationships(tableName, tables)
      + '\n  }\n\n';
  }
  return '';
};

TypeGenerator._columns = function columns(primaryKey, foreignKeys, columns) {
  let colStr = '';
  for (let columnName in columns) {
    if (!(foreignKeys && foreignKeys[columnName]) && columnName !== primaryKey) {
      const { dataType, isNullable } = columns[columnName];
      colStr += `\n    ${toCamelCase(columnName)}: ${typeSet(dataType)}`;
      if (isNullable === 'YES') colStr += '!';
    }
  }
  return colStr;
};

// Get table relationships
TypeGenerator._getRelationships = function getRelationships(tableName, tables) {
  let relationships = '';
  for (let refTableName in tables[tableName].referencedBy) {
    const { referencedBy: foreignRefBy, foreignKeys: foreignTableFKeys } = tables[refTableName];
    const refTableType = capitalize(toCamelCase(singular(refTableName)));
    if (foreignRefBy && foreignRefBy[tableName]) relationships += `\n    ${reftableName}: [${refTableType}]`;
    else relationships += `\n    ${toCamelCase(refTableName)}: [${refTableType}]`;
    for (let foreignTableFKey in foreignTableFKeys) {
      if (tableName !== foreignTableFKeys[foreignTableFKey].referenceTable) {
        const manyToManyTable = toCamelCase(foreignTableFKeys[foreignTableFKey].referenceTable);
        relationships += `\n    ${manyToManyTable}: [${toCamelCase(singular(manyToManyTable))}]`;
      }
    }
  }
  return relationships;
};

TypeGenerator._create = function create(tableName, primaryKey, foreignKeys, columns) {
  return `    ${toCamelCase(`create_${singular(tableName)}`)}(`
    + this._typeParams(primaryKey, foreignKeys, columns)
    + `): ${toCamelCase(singular(tableName))}!\n`;
};

TypeGenerator._update = function update(tableName, primaryKey, foreignKeys, columns) {
  return `    ${toCamelCase(`update_${singular(tableName)}`)}(`
    + this._typeParams(primaryKey, foreignKeys, columns)
    + `): ${singular(tableName)}!\n`;
};

TypeGenerator._destroy = function destroy(tableName, primaryKey) {
  return `    ${toCamelCase(`delete_${singular(tableName)}`)}(${toCamelCase(primaryKey)}: ID!): ${toCamelCase(singular(tableName))}!\n`;
};

TypeGenerator._typeParams = function addParams(primaryKey, foreignKeys, columns) {
  let typeDef = '';
  for (let columnName in columns) {
    const { dataType, isNullable } = columns[columnName];
    if (foreignKeys === null || !foreignKeys[columnName] && columnName !== primaryKey) {
      if (typeDef === '') typeDef += '\n';
      typeDef += `      ${columnName}: ${typeSet(dataType)}`;
      if (isNullable !== 'YES') typeDef += '!';
      typeDef += ',\n';
    }
  }
  if (typeDef !== '') typeDef += '    ';
  return typeDef;
};

module.exports = TypeGenerator;