const { singular } = require('pluralize');
const { capitalize } = require('./../helpers/helperFunctions');

const ResolverGenerator = {};

ResolverGenerator.values = function values(primaryKey, foreignKeys, columns) {
  const valueData = {};
  let index = 1;
  for (columnName in columns) {
    if (!(foreignKeys && foreignKeys[columnName]) && columnName !== primaryKey) {
      valueData[index++] = columnName;
    }
  }
  return valueData;
}

ResolverGenerator.allColumn = function allColumn(table) {
  return `    ${table}: () => {\n`
    + '      try {\n'
    + `        const query = 'SELECT * FROM ${table}';\n`
    + '        return db.query(query).then((res) => res.rows)\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err);\n'
    + '      }\n'
    + '    }';
}

ResolverGenerator.column = function column(table, primaryKey) {
  return `    ${singular(table)}ById: (parent, args) => {\n`
    + '      try{\n'
    + `        const query = 'SELECT * FROM ${table} WHERE ${primaryKey} = $1';\n`
    + `        const values = [args.${primaryKey}]\n`
    + '        return db.query(query).then((res) => res.rows)\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err);\n'
    + '      }\n'
    + '    }';
}

ResolverGenerator.createColumn = function createColumn(table, primaryKey, foreignKeys, columns) {
  const valueData = this.values(primaryKey, foreignKeys, columns);
  return `    create${capitalize(singular(table))}: (parent, args) => {\n`
    + `      const query = 'INSERT INTO ${table}(${Object.values(valueData).join(', ')}) VALUES(${Object.keys(valueData).map(x => `$${x}`).join(', ')})';\n`
    + `      const values = [${Object.values(valueData).map(x => `args.${x}`).join(', ')}];\n`
    + '      try {\n'
    + '        return db.query(query, values);\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err);\n'
    + '      }\n'
    + '    }';
}

ResolverGenerator.updateColumn = function updateColumn(table, primaryKey, foreignKeys, columns) {
  const valueData = this.values(primaryKey, foreignKeys, columns);
  let displaySet = '';
  for (let key in valueData) displaySet += `${valueData[key]}=$${key} `;
  return `    update${capitalize(singular(table))}: (parent, args) => {\n`
    + '      try {\n'
    + `        const query = 'UPDATE ${table} SET ${displaySet} WHERE ${primaryKey} = $${Object.entries(valueData).length + 1}';\n`
    + `        const values = [${Object.values(valueData).map(x => `args.${x}`).join(', ')}, args.${primaryKey}]\n`
    + '        return db.query(query).then((res) => res.rows)\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err);\n'
    + '      }\n'
    + '    }';
}

ResolverGenerator.deleteColumn = function deleteColumn(table, primaryKey) {
  return `    delete${capitalize(singular(table))}: (parent, args) => {\n`
    + '      try {\n'
    + `        const query = 'DELETE FROM ${table} WHERE ${primaryKey} = $1';\n`
    + `        const values = [args.${primaryKey}]\n`
    + '        return db.query(query).then((res) => res.rows)\n'
    + '      } catch (err) {\n'
    + '        throw new Error(err);\n'
    + '      }\n'
    + '    }';
}

module.exports = ResolverGenerator;