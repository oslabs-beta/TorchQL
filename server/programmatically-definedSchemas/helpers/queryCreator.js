const Generate = require('../generators/queryGenerator')

// Returns all queries 
function generateAllQuery(data) {
    console.log('This is all query:', data)
};

// Returns one query

function generateOneQuery(data) {
    console.log('This is one query:', data)
}; 


// Return resolvers
function generateResolvers(allQueryData, oneQueryData) {
    console.log('This is allquery', allQueryData)
    console.log('this is onequery', oneQueryData)
}

// // returns get all query resolvers for each table in SDL format as array of strings
// function generateGetAllQuery(data) {
// 	const queriesAll = [];
// 	// iterates through each data object corresponding to single table in PostgreSQL database
// 	const tables = Object.keys(data);
// 	for (tableName of tables) {
// 		let resolveStr = Generator.allColumns(tableName);
// 	queriesAll.push(resolveStr);
// 	}
// 	return queriesAll;
// }


module.exports = {
    generateAllQuery,
    generateOneQuery,
    generateResolvers
}