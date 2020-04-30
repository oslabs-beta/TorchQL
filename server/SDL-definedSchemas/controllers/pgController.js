const fs = require('fs');
const { Pool } = require('pg');
const SchemaGenerator = require('../generators/schemaGenerator');
const pgQuery = fs.readFileSync('server/queries/tableData.sql', 'utf8');

const pgController = {};

// Middleware function for recovering info from pg tables
pgController.getPGTables = (req, res, next) => {
  const db = new Pool({ connectionString: req.query.uri });
  db.query(pgQuery)
    .then((data) => {
      res.locals.tables = data.rows[0].tables;
      return next();
    })
    .catch((err) => {
      return res.json("error");
      // next({
      //   log: err,
      //   status: 500,
      //   message: { err: 'There was a problem making database query' },
      // })
    }
    );
};

// Middleware function for assembling SDL schema
pgController.assembleSDLSchema = (req, res, next) => {
  try {
    res.locals.SDLSchema = SchemaGenerator.assembleSchema(res.locals.tables);
    return next();
  } catch (err) {
    return next({
      log: err,
      status: 500,
      message: { err: 'There was a problem assembling SDL schema' }
    });
  }
}

module.exports = pgController;
