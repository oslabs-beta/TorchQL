const { singular } = require('pluralize');
const { toCamelCase, toPascalCase } = require('./../helpers/helperFunctions');

const ResolverGenerator = {
  _values: {}
};

ResolverGenerator.queries = function queries(tableName, { primaryKey }) {
  return `\n${this._columnQuery(tableName, primaryKey)}`
    + `\n${this._allColumnQuery(tableName)}`;
};

ResolverGenerator.mutations = function mutations(tableName, tableData) {
  const { primaryKey, foreignKeys, columns } = tableData;
  this._createValues(primaryKey, foreignKeys, columns);
  return `${this._createMutation(tableName, primaryKey, foreignKeys, columns)}\n`
    + `${this._updateMutation(tableName, primaryKey, foreignKeys, columns)}\n`
    + `${this._deleteMutations(tableName, primaryKey)}\n\n`;
};

ResolverGenerator.getRelationships = function getRelationships(tableName, tables) {
  const { primaryKey, referencedBy } = tables[tableName];
  if (!referencedBy) return '';
  let relationships = `\n  ${toPascalCase(singular(tableName))}: {\n`;
  for (let refTableName in referencedBy) {
    const { referencedBy: foreignRefBy, foreignKeys: foreignFKeys, columns: foreignColumns } = tables[refTableName];
    const refTableType = toPascalCase(singular(refTableName));
    // One-to-one
    if (foreignRefBy && foreignRefBy[tableName]) relationships += this._oneToOne(tableName, primaryKey, refTableName, referencedBy[refTableName]);
    // One-to-many
    else if (Object.keys(foreignColumns).length !== Object.keys(foreignFKeys).length + 1) relationships += this._oneToMany(tableName, primaryKey, refTableName, referencedBy[refTableName]);
    // Many-to-many
    for (let foreignFKey in foreignFKeys) {
      if (tableName !== foreignFKeys[foreignFKey].referenceTable) { // Do not include original table in output
        const manyToManyTable = foreignFKeys[foreignFKey].referenceTable;
        const refKey = tables[tableName].referencedBy[refTableName];
        const manyRefKey = tables[manyToManyTable].referencedBy[refTableName];
        const { primaryKey: manyPrimaryKey } = tables[manyToManyTable];
        relationships += this._manyToMany(tableName, primaryKey, refTableName, refKey, manyRefKey, manyToManyTable, manyPrimaryKey);
      }
    }
  }
  relationships += '  },\n'
  return relationships;
};

ResolverGenerator._oneToOne = function oneToOne(tableName, primaryKey, refTableName, refKey) {
  return `    ${toCamelCase(refTableName)}: (${toCamelCase(tableName)}) => {\n`
    + '      try {\n'
    + `        const query = \'SELECT * FROM ${refTableName} WHERE ${refKey} = $1\';\n`
    + `        const values = [${primaryKey}]\n`
    + '        return db.query(query, values).then((res) => res.rows[0]);\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err)\n'
    + '      }\n'
    + '    },\n';
};

ResolverGenerator._oneToMany = function oneToMany(tableName, primaryKey, refTableName, refKey) {
  return `    ${toCamelCase(refTableName)}: (${toCamelCase(tableName)}) => {\n`
    + '      try {\n'
    + `        const query = \'SELECT * FROM ${refTableName} WHERE ${refKey} = $1\';\n`
    + `        const values = [${primaryKey}]\n`
    + '        return db.query(query, values).then((res) => res.rows);\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err)\n'
    + '      }\n'
    + '    },\n';
};

ResolverGenerator._manyToMany = function manyToMany(tableName, primaryKey, joinTableName, refKey, manyRefKey, manyTableName, manyPrimaryKey) {
  const camTableName = toCamelCase(tableName);
  return `    ${toCamelCase(manyTableName)}: (${camTableName}) => {\n`
    + '      try {\n'
    + `        const query = \'SELECT * FROM ${manyTableName} LEFT OUTER JOIN ${joinTableName} ON ${manyTableName}.${manyPrimaryKey} = ${joinTableName}.${manyRefKey} WHERE ${joinTableName}.${refKey} = $1\';\n`
    + `        const values = [${camTableName}.${primaryKey}]\n`
    + '        return db.query(query, values).then((res) => res.rows);\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err)\n'
    + '      }\n'
    + '    },\n';
};

ResolverGenerator._createValues = function values(primaryKey, foreignKeys, columns) {
  let index = 1;
  for (columnName in columns) {
    if (!(foreignKeys && foreignKeys[columnName]) && columnName !== primaryKey) {
      this._values[index++] = columnName;
    }
  }
  return this._values;
};

ResolverGenerator._columnQuery = function column(tableName, primaryKey) {
  let byID = toCamelCase(singular(tableName));
  if (byID === toCamelCase(tableName)) byID += 'ByID';
  return `    ${byID}: (parent, args) => {\n`
    + '      try{\n'
    + `        const query = 'SELECT * FROM ${tableName} WHERE ${primaryKey} = $1';\n`
    + `        const values = [args.${primaryKey}];\n`
    + '        return db.query(query, values).then((res) => res.rows[0]);\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err);\n'
    + '      }\n'
    + '    },';
};

ResolverGenerator._allColumnQuery = function allColumn(tableName) {
  return `    ${toCamelCase(tableName)}: () => {\n`
    + '      try {\n'
    + `        const query = 'SELECT * FROM ${tableName}';\n`
    + '        return db.query(query).then((res) => res.rows);\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err);\n'
    + '      }\n'
    + '    },';
};

ResolverGenerator._createMutation = function createColumn(tableName, primaryKey, foreignKeys, columns) {
  return `    ${toCamelCase(`create_${singular(tableName)}`)}: (parent, args) => {\n`
    + `      const query = 'INSERT INTO ${tableName}(${Object.values(this._values).join(', ')}) VALUES(${Object.keys(this._values).map(x => `$${x}`).join(', ')})';\n`
    + `      const values = [${Object.values(this._values).map(x => `args.${x}`).join(', ')}];\n`
    + '      try {\n'
    + '        return db.query(query, values);\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err);\n'
    + '      }\n'
    + '    },';
};

ResolverGenerator._updateMutation = function updateColumn(tableName, primaryKey, foreignKeys, columns) {
  let displaySet = '';
  for (let key in this._values) displaySet += `${this._values[key]}=$${key} `;
  return `    ${toCamelCase(`update_${singular(tableName)}`)}: (parent, args) => {\n`
    + '      try {\n'
    + `        const query = 'UPDATE ${tableName} SET ${displaySet} WHERE ${primaryKey} = $${Object.entries(this._values).length + 1}';\n`
    + `        const values = [${Object.values(this._values).map(x => `args.${x}`).join(', ')}, args.${primaryKey}];\n`
    + '        return db.query(query).then((res) => res.rows);\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err);\n'
    + '      }\n'
    + '    },';
};

ResolverGenerator._deleteMutations = function deleteColumn(tableName, primaryKey) {
  return `    ${toCamelCase(`delete_${singular(tableName)}`)}: (parent, args) => {\n`
    + '      try {\n'
    + `        const query = 'DELETE FROM ${tableName} WHERE ${primaryKey} = $1';\n`
    + `        const values = [args.${primaryKey}];\n`
    + '        return db.query(query).then((res) => res.rows);\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err);\n'
    + '      }\n'
    + '    },';
};

module.exports = ResolverGenerator;