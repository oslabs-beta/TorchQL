const fs = require('fs');
const { Pool } = require('pg');
const pgQuery = fs.readFileSync('server/queries/tableData.sql', 'utf8')
const DBController = {};

DBController.getPGTables = (req, res, next) => {
  const db = new Pool({ connectionString: req.body.DB_URI });
  db.query(pgQuery)
    .then((data) => {
      res.locals.tables = data.rows;
      return next();
    })
    .catch((err) => next({
      log: '',
      status: 500,
      message: { err }
    }));
};

module.exports = DBController;
