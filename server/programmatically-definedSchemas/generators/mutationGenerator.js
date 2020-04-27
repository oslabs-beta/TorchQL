const { singular } = require('pluralize');
const { capitalize } = require('../../SDL-definedSchemas/helpers/helperFunctions');
const { toPascalCase, toCamelCase, getDataType, getPrimaryKeyType } = require('../helpers/helperFunctions');

const MutationGenerator = {
  _values: {}
};

MutationGenerator.createColumn = function createColumn(tableName, primaryKey, foreignKeys, columns) {
    const singleName = singular(tableName);
		const capSingle = capitalize(singleName);
		let needNull = true;
		this._createValues(primaryKey, foreignKeys, columns);
    return (
            `    ${toCamelCase(`add_${singular(singleName)}`)}: {\n`
        +   `      type: ${toPascalCase(singleName)}Type,\n`
        +   `        args: {`
        +   `${this._columns(primaryKey, foreignKeys, columns, needNull)}\n`
        +   `        },\n` 
        +   `        resolve(parent, args) {\n`     
        +   `          try {\n`   
        +   `            const query = \`INSERT INTO ${tableName}(${Object.values(this._values).join(', ')})\n`      
        +   `            VALUES(${Object.keys(this._values).map(x => `$${x}`).join(', ')})\`\n`
        +   `            const values = [${Object.values(this._values).map(x => `args.${x}`).join(', ')}]\n`
        +   `            return db.query(query, values).then((res) => res.rows[0]);\n`
        +   `          } catch(err) {\n`
        +   `            throw new Error(err);\n`
        +   `          }\n`
        +   `        },\n`
        +   `      },`
    );
};

MutationGenerator.updateColumn = function updateColumn(tableName, primaryKey, foreignKeys, columns) {
    const singleName = singular(tableName);
		const capSingle = capitalize(singleName);
		let needNull = false;
		this._createValues(primaryKey, primaryKey, foreignKeys, columns);
		let displaySet = '';
    for (let key in this._values) displaySet += `${this._values[key]}=$${key} `;
    return (
            `    ${toCamelCase(`update_${singular(singleName)}`)}: {\n`
        +   `      type: ${toPascalCase(singleName)}Type,\n`
        +   `      args: {`
        +   `${this._columns(primaryKey, foreignKeys, columns, needNull)}\n`
        +   `      },\n`
        +   `      resolve(parent, args) {\n`
        +   `        try { \n`
        +   `          const query = \`UPDATE ${tableName}\n`
        +   `          SET ${displaySet}\`\n`
        +   `          WHERE ${primaryKey} = $${Object.entries(this._values).length + 1}\n`
        +   `          const values = [${Object.values(this._values).map(x => `args.${x}`).join(', ')}, args.${primaryKey}]\n`
        +   `          return db.query(query, values).then((res) => res.rows[0]);\n`
        +   `        } catch(err) {\n`
        +   `          throw new Error(err);\n`
        +   `        }\n`
        +   `      },\n`
        +   `    },\n`
    );
};

MutationGenerator.destroyColumn = (tableName, primaryKey, columns) => {
    const singleName = singular(tableName);
    const capSingle = capitalize(singleName);
		const primaryKeyType = getPrimaryKeyType(primaryKey, columns);
    return(
            `   ${toCamelCase(`delete_${singleName}`)}: {\n`
        +   `       type: ${toPascalCase(singleName)}Type,\n`
        +   `       args: {\n`
        +   `         ${primaryKey}: { type: newGraphQLNonNull(${primaryKeyType}) },\n`
        +   `       },\n`
        +   `       resolve(parent, args) {\n`
        +   `       try {\n`
        +   `         const query = \`DELETE FROM ${tableName}\n`
        +   `         WHERE ${primaryKey} = $1\`;\n`
        +   `         const values = [args.${primaryKey}]\n`
        +   `         return db.query(query, values).then((res) => res.rows[0]);\n`
        +   `       } catch(err) {\n`
        +   `           throw new Error(err)\n`
        +   `       }\n`
        +   `     },\n`
        +   `   },`
    );
};

MutationGenerator._createValues = function values(primaryKey, foreignKeys, columns) {
	let index = 1;
	for (columnName in columns) {
			if (!(foreignKeys && foreignKeys[columnName]) && columnName !== primaryKey) {
			this._values[index++] = columnName;
			}
	}
	return this._values;
};

MutationGenerator._columns = function columns(primaryKey, foreignKeys, columns, needNull) {
	let colStr = '';
  for (let columnName in columns) {
    if (!(foreignKeys && foreignKeys[columnName]) && columnName !== primaryKey) {
			const { dataType, isNullable } = columns[columnName];
			colStr += `\n          ${columnName}: { type: `
			if (needNull && isNullable === 'NO') colStr += 'new GraphQLNonNull(';
			colStr +=  `${getDataType(dataType)}`;
			if (needNull && isNullable === 'NO') colStr += ')';
			colStr += ` },`;
    }
  }
  return colStr;
};

module.exports = MutationGenerator;