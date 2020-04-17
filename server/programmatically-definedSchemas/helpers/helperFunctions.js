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
  getDataType,
  storeIndexedColumns,
  getValsAndTypes,
  getPrimaryKeyType,
};
