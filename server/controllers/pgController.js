const fs = require('fs');
const { Pool } = require('pg');
const pgQuery = fs.readFileSync('server/queries/tableData.sql', 'utf8')
const pgController = {};
const {
	createQuery,
	createTypes
} = require("../functions/typesCreator");

// middleware function for recovering info from pg tables
pgController.getPGTables = (req, res, next) => {
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

// middleware function for making query root types in SDL
pgController.makeQueries = (req, res, next) => {
	let queries = createQuery(res.locals.tables);
	console.log('queries: ', queries);
	return next();
}

// middleware function for making custom object types in SDL
pgController.makeTypes = (req, res, next) => {
	let types = createTypes(res.locals.tables);
	console.log('types: ', types);
	return next();
}

module.exports = pgController;