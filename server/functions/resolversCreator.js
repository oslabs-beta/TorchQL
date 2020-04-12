const { singular } = require("pluralize");

const generateGetAllQuery = (arr) => {
    const queriesAll = [];
    for ({ tableName } of arr) {
      let resolveStr = 
      `${tableName}: () => {
      try{
        const query = 'SELECT * FROM ${tableName}';
        return db.query(query).then((res) => res.rows)
      } catch (err) {
        throw new Error(err);
      }
    }
      `;
    queriesAll.push(resolveStr);
    }
    return queriesAll;
  };

  const generateGetOneQuery = (arr) => {
    const queriesById = [];
    for ({ tableName, primaryKey } of arr) {
    let resolveStr = `${singular(tableName)}ById: (parent, args) => {
      try{
        const query = 'SELECT * FROM ${tableName} WHERE ${primaryKey} = $1';
        const values = [args.${primaryKey}]
        return db.query(query).then((res) => res.rows)
      } catch (err) {
        throw new Error(err);
      }
    }
    `;
    queriesById.push(resolveStr);
    }
    return queriesById;
  };

  const generateQueryResolvers = (arr1, arr2) => {
    let resolveStr = '`const resolvers = {\n\xa0\xa0Query: {';
    for (i = 0; i < arr1.length; i++) {
      resolveStr += `\n    ${arr1[i]}\n    ${arr2[i]}\n
    }`;
    }
    return resolveStr;
  };

module.exports = {
  generateGetAllQuery,
  generateGetOneQuery,
  generateQueryResolvers
};