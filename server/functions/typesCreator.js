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
  arr.forEach(({ tableName }) => {
    const nameSingular = singular(tableName);
    typeStr += `\n${tableName}:[${capitalize(nameSingular)}!]!`
      + `\n${nameSingular}ByID(${nameSingular}id:ID):${capitalize(nameSingular)}!`;
  });
  return typeStr;
}

// returns mutation types in SDL as string
function createMutation(arr) {
	let typeStr = '';
	arr.forEach(obj => {
		let name = obj.table_name;
		console.log('name: ', name);
		let primaryKey = obj.primary_key;
		console.log('primaryKey: ', primaryKey);
		// let foreignKeys = obj.foreign_keys.map(x => x.name);
		// console('foreignKeys: ', foreignKeys);
		let nameSingular = pluralize.singular(name);
		typeStr += `
		  create${capitalize(nameSingular)}(`;
		obj.columns.forEach((columnObj, index) => {
			if (columnObj.column_name !== primaryKey)  {
				if (index !== 0) {
					typeStr += `, `;
				}
				typeStr += `${columnObj.column_name}: ${typeSet(columnObj.data_type)}`;
				if (columnObj.is_nullable === "YES") {
					typeStr += '!';
				}
			}
	
		});
			// typeStr += `
			// 	update${capitalize(nameSingular)}(${columnObj.column_name}: ${typeSet(columnObj.data_type)})`;
			// typeStr += `
			// 	delete${capitalize(nameSingular)}`;

		typeStr += `): ${capitalize(nameSingular)}!`;
	});
	return typeStr;
}

// returns custom objects types in SDL as string
function createTypes(arr) {
  let typeStr = '';
  for({ tableName, primaryKey, foreignKeys, columns } of arr) {
    const fkCache = {};
    for (let key of foreignKeys) fkCache[key.name] = key;
    typeStr += `\ntype ${capitalize(singular(tableName))} {\n  ${primaryKey}:Int!`;
    // adds all columns with types to SDL string
    for (column of columns) {
    // adds foreign keys with object type to SDL string
      if (fkCache[column.columnName]) {
        const { name, referenceTable, referenceKey } = fkCache[column.columnName];
        // supposed to check for one-to-many relationship before displaying type as array
        if (refsMany(fkCache[column.columnName])) typeStr += `\n  ${name}:[${capitalize(referenceTable)}]`;
        else typeStr += `\n  ${name}:${capitalize(singular(referenceTable))}`;
      // adds remaining columns with types to SDL string
      } else if (column.columnName !== primaryKey) {
        typeStr += `\n  ${column.columnName}:${typeSet(column.dataType)}`;
        if (column.isNullable === 'YES') typeStr += '!';
      }
    }
    typeStr += '\n}';
  }
  return typeStr;
}


module.exports = {
		createQuery,
		createMutation,
		createTypes
};