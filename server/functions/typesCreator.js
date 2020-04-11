const { singular } = require("pluralize");

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
function refsMany({ table, tableKey, ref, refKey }) {
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
  let typeStr = '';
  arr.forEach(({ table_name }) => {
    const nameSingular = singular(table_name);
    typeStr += `
      ${table_name}:[${capitalize(nameSingular)}!]!
      ${nameSingular}ByID(${nameSingular}id:ID):${capitalize(nameSingular)}!`;
  });
  return typeStr;
}

// returns custom objects types in SDL as string
function createTypes(arr) {
  let typeStr = '';
  for({ table_name, primary_key, foreign_keys, columns } of arr) {
    const fkCache = {};
    for (let key of foreign_keys) fkCache[key.name] = key;
    typeStr += `\ntype ${capitalize(singular(table_name))} {\n${primary_key}:Int!`;
    // adds all columns with types to SDL string
    for (column of columns) {
    // adds foreign keys with object type to SDL string
      if (fkCache[column.column_name]) {
        const { name, reference_table, reference_key } = fkCache[column.column_name];
        // supposed to check for one-to-many relationship before displaying type as array
        if (refsMany(fkCache[column.column_name])) typeStr += `\n${name}:[${capitalize(reference_table)}]`;
        else typeStr += `\n${name}:${capitalize(singular(reference_table))}`;
      // adds remaining columns with types to SDL string
      } else if (column.column_name !== primary_key) {
        typeStr += `\n${column.column_name}:${typeSet(column.data_type)}`;
        if (column.is_nullable === 'YES') typeStr += '!';
      }
    }
    typeStr += '\n}';
  }
  return typeStr;
}


module.exports = {
    createQuery,
    createTypes
};