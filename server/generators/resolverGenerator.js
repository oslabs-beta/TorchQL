const { singular } = require('pluralize');
const { capitalize } = require('./../helpers/helperFunctions');

const ResolverGenerator = {};

ResolverGenerator.allColumns = (table) => {
  return `${table}: () => {\n`
    + '    try {\n'
    + `      const query = 'SELECT * FROM ${table}';\n`
    + '      return db.query(query).then((res) => res.rows)\n'
    + '    } catch (err) {\n'
    + '      throw new Error(err);\n'
    + '    }\n'
    + '  }';
};

ResolverGenerator.column = (table, primaryKey) => {
  return `${singular(table)}ById: (parent, args) => {\n`
    + '    try{\n'
    + `      const query = 'SELECT * FROM ${table} WHERE ${primaryKey} = $1';\n`
    + `      const values = [args.${primaryKey}]\n`
    + '      return db.query(query).then((res) => res.rows)\n'
    + '    } catch (err) {\n'
    + '      throw new Error(err);\n'
    + '    }\n'
    + '  }';
};

ResolverGenerator.createColumn = (table, data) => {
  return `create${capitalize(singular(table))}: (parent, args) => {\n`
    + `    const query = 'INSERT INTO ${table}(${Object.values(data).join(', ')}) VALUES(${Object.keys(data).map(x => `$${x}`).join(', ')})';\n`
    + `    const values = [${Object.values(data).map(x => `args.${x}`).join(', ')}];\n`
    + '    try {\n'
    + '      return db.query(query, values);\n'
    + '    } catch (err) {\n'
    + '      throw new Error(err);\n'
    + '    }\n'
    + '  }';
};

ResolverGenerator.updateColumn = (table, primaryKey, obj, displaySet) => {
  return `update${capitalize(singular(table))}: (parent, args) => {\n`
    + '    try {\n'
    + `      const query = 'UPDATE ${table} SET ${displaySet}WHERE ${primaryKey} = $${Object.entries(obj).length + 1}';\n`
    + `      const values = [${Object.values(obj).map(x => `args.${x}`).join(', ')}, args.${primaryKey}]\n`
    + '      return db.query(query).then((res) => res.rows)\n'
    + '    } catch (err) {\n'
    + '      throw new Error(err);\n'
    + '    }\n'
    + '  }';
};

ResolverGenerator.deleteColumn = (table, primaryKey) => {
  return `delete${capitalize(singular(table))}: (parent, args) => {\n`
    + '    try {\n'
    + `      const query = 'DELETE FROM ${table} WHERE ${primaryKey} = $1';\n`
    + `      const values = [args.${primaryKey}]\n`
    + '      return db.query(query).then((res) => res.rows)\n'
    + '    } catch (err) {\n'
    + '      throw new Error(err);\n'
    + '    }\n'
    + '  }';
};

module.exports = ResolverGenerator;