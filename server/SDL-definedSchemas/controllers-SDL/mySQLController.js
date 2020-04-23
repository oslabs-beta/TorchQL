const mysql = require('mysql');
const fs = require('fs');
const pgQuery = fs.readFileSync('server/queries/tableData.sql', 'utf8');
const mySQLController = {};

mySQLController.getTables = (req, res, next) => {
  // const db = mysql.createPool(req.query.uri);
  res.locals.mysqltables = "mySQLController.getMySQLTables"
  return next();
}

module.exports = mySQLController;