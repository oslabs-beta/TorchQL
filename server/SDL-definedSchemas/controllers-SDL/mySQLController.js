const mysql = require('mysql');
const fs = require('fs');
const pgQuery = fs.readFileSync('server/queries/tableData.sql', 'utf8');
const mySQLController = {};

mySQLController.getMySQLTables = (req, res, next) => {
  const db = mysql.createPool(req.query.uri);
}