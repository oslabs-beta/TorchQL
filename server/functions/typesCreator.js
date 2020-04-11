const pluralize = require("pluralize");

function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function typeSet(str) {
  switch (str) {
    case "character varying":
      return "String";
      break;
    case "character":
      return "String";
      break;
    case "integer":
      return "Int";
      break;
    case "text":
      return "String";
      break;
    case "date":
      return "String";
      break;
    case "boolean":
      return "Boolean";
      break;
    default: 
      return "Int";
  }
}

// supposed to check for one-to-many relationship between foreign key and primary key on two tables, doesn't work yet
function refsMany(table, tableKey, ref, refKey) {
//   const queryStr = `SELECT * FROM people INNER JOIN planets ON planets._id = people.homeworld_id`;
//   console.log('querystr: ', queryStr);
//   db.query(queryStr, (err, data) => {
//     if (err) {
//       return err;
//     } else {
//         console.log('data.rows :', data.rows);
//         console.log('data.rows.length :', data.rows.length);
//         if (data.rows.length > 1) { 
//           return true
//         } else return false;
//       }
//   });
  return false;
}

// returns query types in SDL as string
function createQuery(arr) {
  const tableNames = arr.map(obj => obj.table_name);
  let typeStr = '';
  tableNames.forEach(name => {
    let nameSingular = pluralize.singular(name);
    typeStr += `
      ${name}:[${capitalize(nameSingular)}!]!
      ${nameSingular}ByID(${nameSingular}id:ID):${capitalize(nameSingular)}!`;
  });
  return typeStr;
}

// returns custom objects types in SDL as string
function createTypes(arr) {
  let typeStr = '';
  arr.forEach(obj => {
    let foreignKeys = obj.foreign_keys;
    let primaryKey = obj.primary_key;
    let name = obj.table_name;
    let nameSingular = pluralize.singular(name);
    typeStr += `
      type ${capitalize(nameSingular)} {`;
    typeStr += `
          ${primaryKey}:Int!`;
    // adds all columns with types to SDL string
    obj.columns.forEach(columnObj => {
    // adds foreign keys with object type to SDL string
      if (foreignKeys.map(x => x.name).includes(columnObj.column_name)) {
        let [ foreignKeyObj ] = foreignKeys.filter(x => x.name === columnObj.column_name);
        let foreignTable = foreignKeyObj.reference_table;
        let foreignTableSingular = pluralize.singular(foreignTable);
        console.log('foreignKeyObj', foreignKeyObj);
        // supposed to check for one-to-many relationship before displaying type as array
        if (refsMany(name, foreignKeyObj.name, foreignKeyObj.reference_table, foreignKeyObj.reference_key)) {
          typeStr += `
        ${foreignKeyObj.name}:[${capitalize(foreignTable)}]`;
        } else {
            typeStr += `
          ${foreignKeyObj.name}:${capitalize(foreignTableSingular)}`;
          }
      // adds remaining columns with types to SDL string
      } else if (columnObj.column_name !== primaryKey) {
                typeStr += `
          ${columnObj.column_name}:${typeSet(columnObj.data_type)}`;
                if (columnObj.is_nullable === "YES") {
                  typeStr += '!';
                }
             }
    });
    typeStr += `
      }`;
  })
  return typeStr;
}


module.exports = {
    createQuery,
    createTypes
};