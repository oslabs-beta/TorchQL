const Generate = require('../generators/queryGenerator');

// Returns all queries 
function generateAllQuery(data) {
    const allQuery = [];
    const table = Object.keys(data);
    for(let i = 0; i < table.length; i += 1){
        let allQueryStr = Generate.allColumns(table[i]);
        allQuery.push(allQueryStr);
    }
    return allQuery;
};

// Returns one query

function generateOneQuery(data) {
    // const oneQuery = [];
    // const table = Object.keys(data);
    // for(let i = 0; i < table.length; i += 1){
    //     const { primaryKey } = data[table[i]];
    //     let oneQueryStr = Generate.column(table[i], primaryKey)
    //     console.log(oneQueryStr)
    // }
    // console.log('This is one query:', oneQuery)
}; 


// Return resolvers
function generateResolvers(allQueryData, oneQueryData) {
    console.log('This is allquery' )
    console.log('this is onequery')
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