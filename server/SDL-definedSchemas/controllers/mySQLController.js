const mysql = require('mysql2');
const mySQLController = {};

// This method is suitable for older SQL databases
mySQLController.getTables = (req, res, next) => {
  const config = {
    host: 'localhost',
    user: 'zac',
    password: '123456',
    database: 'acme',
  };
  const connection = mysql.createConnection(config);
  connection.query(
    `
SELECT * FROM information_schema.columns
WHERE TABLE_SCHEMA = '${config.database}'
`,
    (err, results, fields) => {
      if (err) {
        return next({
          log: 'There was a problem making MySQL database query',
          status: 500,
          message: { err },
        });
      }
      console.log(results);
      res.locals.tables = results;
      res.locals.fields = fields;
      return next();
    }
  );
};

module.exports = mySQLController;
