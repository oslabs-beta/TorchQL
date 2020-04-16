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
    const oneQuery = [];
    const table = Object.keys(data);
    for(let i = 0; i < table.length; i += 1){
        const { primaryKey } = data[table[i]];
        let oneQueryStr = Generate.column(table[i], primaryKey)
        oneQuery.push(oneQueryStr)
    }
    return oneQuery;
}; 

function generateReturnQueries(allQuery, oneQuery) {
    let queryStr = '';
    for(let i = 0; i < allQuery.length; i += 1) queryStr += `\n ${allQuery[i]} \n ${oneQuery[i]}`
    return queryStr;
}

module.exports = {
    generateAllQuery,
    generateOneQuery,
    generateReturnQueries
}