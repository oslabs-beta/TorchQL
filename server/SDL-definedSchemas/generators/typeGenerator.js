const { singular } = require('pluralize');
const { toCamelCase, toPascalCase, typeSet, getPrimaryKeyType } = require('./../helpers/helperFunctions');

const TypeGenerator = {};

TypeGenerator.queries = function queries(tableName, tableData) {
  const { primaryKey, foreignKeys, columns } = tableData;
  const nameSingular = singular(tableName);
  const primaryKeyType = getPrimaryKeyType(primaryKey, columns);
  if (!foreignKeys || Object.keys(columns).length !== Object.keys(foreignKeys).length + 1) { // Do not output pure join tables
    let byID = toCamelCase(nameSingular);
    if (nameSingular === tableName) byID += 'ByID';
    return `    ${toCamelCase(tableName)}: [${toPascalCase(nameSingular)}!]!\n`
      + `    ${byID}(${primaryKey}: ${primaryKeyType}!): ${toPascalCase(nameSingular)}!\n`;
  }
  return '';
};

TypeGenerator.mutations = function mutations(tableName, tableData) {
  const { primaryKey, foreignKeys, columns } = tableData;
  if (!foreignKeys || Object.keys(columns).length !== Object.keys(foreignKeys).length + 1) { // Do not output pure join tables
    return this._create(tableName, primaryKey, foreignKeys, columns)
      + this._update(tableName, primaryKey, foreignKeys, columns)
      + this._destroy(tableName, primaryKey);
  }
  return '';
};

TypeGenerator.customTypes = function customTypes(tableName, tables) {
  const { primaryKey, foreignKeys, columns } = tables[tableName];
  const primaryKeyType = getPrimaryKeyType(primaryKey, columns);
  if (foreignKeys === null || Object.keys(columns).length !== Object.keys(foreignKeys).length + 1) {
    return `  type ${toPascalCase(singular(tableName))} {\n`
      + `    ${primaryKey}: ${primaryKeyType}!`
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
      const { dataType, isNullable, columnDefault } = columns[columnName];
      colStr += `\n    ${columnName}: ${typeSet(dataType)}`;
      if (isNullable === 'NO' && columnDefault === null) colStr += '!';
    }
  }
  return colStr;
};

// Get table relationships
TypeGenerator._getRelationships = function getRelationships(tableName, tables) {
  let relationships = '';
  const relationsAdded = [];
  for (let refTableName in tables[tableName].referencedBy) {
    const { referencedBy: foreignRefBy, foreignKeys: foreignFKeys, columns: foreignColumns } = tables[refTableName];
    // One-to-one
    if (foreignRefBy && foreignRefBy[tableName]) {
      if (!relationsAdded.includes(refTableName)) {
        relationsAdded.push(refTableName);
        const refTableType = toPascalCase(singular(refTableName));
        relationships += `\n    ${toCamelCase(singular(reftableName))}: ${refTableType}`;
      }
    }
    // One-to-many
    else if (Object.keys(foreignColumns).length !== Object.keys(foreignFKeys).length + 1) {
      if (!relationsAdded.includes(refTableName)) {
        relationsAdded.push(refTableName);
        const refTableType = toPascalCase(singular(refTableName));
        relationships += `\n    ${toCamelCase(refTableName)}: [${refTableType}]`;
      }
    }
    // Many-to-many
    for (let foreignFKey in foreignFKeys) {
      if (tableName !== foreignFKeys[foreignFKey].referenceTable) { // Do not include original table in output
        const manyToManyTable = toCamelCase(foreignFKeys[foreignFKey].referenceTable);
        relationships += `\n    ${manyToManyTable}: [${toPascalCase(singular(manyToManyTable))}]`;
      }
    }
  }
  return relationships;
};

TypeGenerator._create = function create(tableName, primaryKey, foreignKeys, columns) {
  return `    ${toCamelCase(`create_${singular(tableName)}`)}(`
    + this._typeParams(primaryKey, foreignKeys, columns)
    + `): ${toPascalCase(singular(tableName))}!\n`;
};

TypeGenerator._update = function update(tableName, primaryKey, foreignKeys, columns) {
  return `    ${toCamelCase(`update_${singular(tableName)}`)}(`
    + this._typeParams(primaryKey, foreignKeys, columns)
    + `): ${toPascalCase(singular(tableName))}!\n`;
};

TypeGenerator._destroy = function destroy(tableName, primaryKey) {
  return `    ${toCamelCase(`delete_${singular(tableName)}`)}(${toCamelCase(primaryKey)}: ID!): ${toPascalCase(singular(tableName))}!\n\n`;
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
