function toPascalCase(str) {
  return capitalize(toCamelCase(str));
}

function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function toCamelCase(str) {
  let varName = str.toLowerCase();
  for (let i = 0, len = varName.length; i < len; i++) {
    const isSeparator = varName[i] === '-' || varName[i] === '_';
    if (varName[i + 1] && isSeparator) {
      const char = (i === 0) ? varName[i + 1] : varName[i + 1].toUpperCase();
      varName = varName.slice(0, i) + char + varName.slice(i + 2);
    } else if (isSeparator) {
      varName = varName.slice(0, i);
    }
  }
  return varName;
}

const getDataType = (str) => {
  switch (str) {
    case 'character varying':
      return 'GraphQLString';
      break;
    case 'character':
      return 'GraphQLString';
      break;
    case 'integer':
      return 'GraphQLInt';
      break;
    case 'text':
      return 'GraphQLString';
      break;
    case 'date':
      return 'GraphQLString';
      break;
    case 'boolean':
      return 'GraphQLBoolean';
      break;
    default:
      return 'GraphQLInt';
  }
};

function storeIndexedColumns(obj, key) {
  const newObj = {};
  let index = 1;
  const columnNames = Object.keys(obj);
  for (columnName of columnNames) {
    if (columnName !== key) {
      newObj[index++] = columnName;
    }
  }
  return newObj;
}

function getValsAndTypes(obj) {
  const newObj = {};
  for (const val in obj) {
    newObj[val] = obj[val].dataType;
  }
  return newObj;
}

function getPrimaryKeyType(primaryKey, columns) {
  return getDataType(columns[primaryKey].dataType);
}

module.exports = {
  toPascalCase,
  capitalize,
  toCamelCase,
  getDataType,
  storeIndexedColumns,
  getValsAndTypes,
  getPrimaryKeyType,
};
