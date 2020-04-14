

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

function createValuesArray(array) {
	let output = [];
	for (i = 1; i <= array.length; i++) {
		if (i < array.length) output.push(`$${i}, `);
		else output.push(`$${i}`);
	}
	return output.join(' ');
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

module.exports = {
	capitalize,
	typeSet,
	createValuesArray
};