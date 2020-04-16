const { singular } = require('pluralize');
const { capitalize } = require('../../helpers/helperFunctions');
const { getDataType, getValsAndTypes } = require('../helpers/helperFunctions');

const MutationGenerator = {};

MutationGenerator.createColumn = (tableName, values, columns) => {
  const singleName = singular(tableName);
  const capSingle = capitalize(singleName);

  const generateArgs = (values) => {
    // loop through args
    // get data type for each
    // return string
    let argsArray = [];
    const valsAndTypes = Object.entries(getValsAndTypes(columns));
    for (let i = 0; i < values.length; i++) {
      const dataType = getDataType(valsAndTypes[i][1]);
      // TODO: Account for non-nulls
      // if (value[2] === 'NO') {
      //   argsArray.push(
      //     `        ${value[0]}: { type: new GraphQLNonNull(${dataType}) },`
      //   );
      // } else {
      argsArray.push(`${values[i]}: { type: ${dataType} }`);
    }

    return '    ' + argsArray.join(', ');
  };

  // Array of column names

  const valsArr = Object.values(values);

  const numCount = (valsArr) => {
    let numArr = [];
    for (let i = 1; i <= valsArr.length; i++) {
      numArr.push('$' + i);
    }

    return numArr;
  };
  return (
    `    add${capSingle}: {\n` +
    `      type: ${capSingle}Type,\n` +
    `      args: {\n` +
    generateArgs(valsArr) +
    `      },\n` +
    `      resolve(parent, args) {\n` +
    `        try {\n` +
    `          const query = \`INSERT INTO ${tableName}(${valsArr.join(
      ', '
    )})\n` +
    `          VALUES(${numCount(valsArr).join(', ')})\`\n` +
    `          const values = [${valsArr
      .map((val) => 'args.' + val)
      .join(', ')}]\n` +
    `          return db.query(query, values).then((res) => res.rows[0]);\n` +
    `        } catch (err) {\n` +
    `          throw new Error(err);\n` +
    `        }\n` +
    `      },\n` +
    `    },\n`
  );
};

MutationGenerator.updateColumn = (tableName, values, primaryKey) => {
  const singleName = singular(tableName);
  const capSingle = capitalize(singleName);
  // values: column and data type [[value, dataType, nullStatus]]
  const generateArgs = (values) => {
    // loop through args
    // get data type for each
    // return string
    let argsArray = [];

    for (const value of values) {
      const dataType = getDataType(value);
      argsArray.push(`${value}: { type: ${dataType} }`);
    }

    return '    ' + argsArray.join(', ');
  };

  // Array of column names
  const valsArr = Object.values(values);
  const valsAndNums = (valsArr) => {
    let valNumArr = [];
    for (let i = 1; i <= valsArr.length; i++) {
      valNumArr.push(`${valsArr[i]}=$${i}`);
    }

    return valNumArr;
  };
  return (
    `    update${capSingle}: { \n` +
    `      type: ${capSingle}Type,` +
    `      args: {` +
    generateArgs(valsArr) +
    `      }, \n` +
    `      resolve(parent, args) { \n` +
    `        try { \n` +
    `          const query = \`UPDATE ${tableName}(${valsArr.join(', ')}) \n` +
    `          SET(${valsAndNums(valsArr).join(', ')})\`\n` +
    `        WHERE ${primaryKey}=${valsArr.length}` +
    `          const values = [${valsArr
      .map((val) => 'args.' + val)
      .join(', ')}, args.${primaryKey}]\n` +
    `          return db.query(query, values).then((res) => res.rows[0]);\n` +
    `        } catch (err) {\n` +
    `          throw new Error(err);\n` +
    `        }\n` +
    `      },\n` +
    `    },\n`
  );
};

MutationGenerator.destroyColumn = (tableName, primaryKey, primaryKeyType) => {
  const singleName = singular(tableName);
  const capSingle = capitalize(singleName);

  return (
    `    delete${capSingle}: {` +
    `      type: ${capSingle}Type,` +
    `      args: {` +
    `        ${primaryKey}: { type: new GraphQLNonNull(${primaryKeyType}) },` +
    `      },` +
    `      resolve(parent, args) {` +
    `        try {` +
    `          const query = \`DELETE FROM ${tableName}` +
    `        WHERE ${primaryKey}=$1\`;` +
    `        const values = [args.${primaryKey}]` +
    `        return db.query(query, values).then((res) => res.rows[0]);` +
    `        } catch (err) {` +
    `          throw new Error(err)` +
    `        }` +
    `      },` +
    `    },`
  );
};

module.exports = MutationGenerator;
