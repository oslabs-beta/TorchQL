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
    SELECT  A.*,
      B.TABLE_NAME,
      B.COLUMN_NAME,
      B.CONSTRAINT_NAME,
      B.REFERENCED_TABLE_NAME,
      B.REFERENCED_COLUMN_NAME
    FROM information_schema.columns AS A
    LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS B
    ON (A.TABLE_NAME = B.TABLE_NAME) 
      AND (A.COLUMN_NAME = B.COLUMN_NAME)
    WHERE A.TABLE_SCHEMA = '${config.database}'
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
