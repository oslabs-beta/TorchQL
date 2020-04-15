const { singular } = require('pluralize');
const { capitalize } = require('../../helpers/helperFunctions');
const { getDataType } = require('../helpers/helperFunctions');

const MutationGenerator = {};

MutationGenerator.createColumn = (tableName, values) => {
  const singleName = singular(tableName);
  const capSingle = capitalize(singleName);

  // values: column and data type [[value, dataType, nullStatus]]
  const generateArgs = (values) => {
    // loop through args
    // get data type for each
    // return string
    let argsArray = [];
    for (const value of values) {
      const dataType = getDataType(value[1]);
      if (value[2] === 'NO') {
        argsArray.push(
          `        ${value[0]}: { type: new GraphQLNonNull(${dataType}) },`
        );
      } else {
        argsArray.push(`      ${value[0]}: { type: ${dataType} }`);
      }
    }
    return argsArray;
  };

  // Array of column names
  const valsArr = values.map((subArr) => subArr[0]);
  const numCount = (valsArr) => {
    let numArr = [];
    for (let i = 1; i <= valsArr.length; i++) {
      numArr.push('$' + i);
    }
    return numArr;
  };

  return (
    `    add${capSingle}: {` +
    `      type: ${capSingle}Type,` +
    `      args: {` +
    generateArgs(values) +
    `      },` +
    `      resolve(parent, args) {` +
    `        try {` +
    `          const query = \`INSERT INTO ${tableName}(${valsArr.join(
      ', '
    )})` +
    `          VALUES(${numCount.join(', ')})\`` +
    `          const values = [${valsArr
      .map((val) => 'args.' + val)
      .join(', ')}]` +
    `          return db.query(query, values).then((res) => res.rows[0]);` +
    `        } catch (err) {` +
    `          throw new Error(err);` +
    `        }` +
    `      },` +
    `    },`
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
      const dataType = getDataType(value[1]);
      argsArray.push(`      ${value[0]}: { type: ${dataType} }`);
    }

    return argsArray;
  };

  // Array of column names
  const valsArr = values.map((subArr) => subArr[0]);
  const valsAndNums = (valsArr) => {
    let valNumArr = [];
    for (let i = 1; i <= valsArr.length; i++) {
      valNumArr.push(`${valsArr[i]}=$${i}`);
    }
    return valNumArr;
  };

  return (
    `    update${capSingle}: {` +
    `      type: ${capSingle}Type,` +
    `      args: {` +
    generateArgs(values) +
    `      },` +
    `      resolve(parent, args) {` +
    `        try {` +
    `          const query = \`UPDATE ${tableName}(${valsArr.join(', ')})` +
    `          SET(${valsAndNums.join(', ')})\`` +
    `        WHERE ${primaryKey}=${valsArr.length}` +
    `          const values = [${valsArr
      .map((val) => 'args.' + val)
      .join(', ')}, args.${primaryKey}]` +
    `          return db.query(query, values).then((res) => res.rows[0]);` +
    `        } catch (err) {` +
    `          throw new Error(err);` +
    `        }` +
    `      },` +
    `    },`
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

module.export = MutationGenerator;
