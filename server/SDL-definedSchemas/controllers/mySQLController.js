const mysql = require('mysql2');
const mySQLController = {};

// This method is suitable for older SQL databases
mySQLController.getTables = (req, res, next) => {
  const config = {
    host: req.body.host,
    user: req.body.user,
    password: req.body.password,
    database: req.body.database,
  };
  const connection = mysql.createConnection(config);
//   const queryStr = `
//   SELECT  A.*,
//     B.TABLE_NAME,
//     B.COLUMN_NAME,
//     B.CONSTRAINT_NAME,
//     B.REFERENCED_TABLE_NAME,
//     B.REFERENCED_COLUMN_NAME
//   FROM information_schema.columns AS A
//   LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS B
//   ON (A.TABLE_NAME = B.TABLE_NAME) 
//     AND (A.COLUMN_NAME = B.COLUMN_NAME)
//   WHERE A.TABLE_SCHEMA = '${config.database}'
// `
  connection.query('SHOW tables',
    async (err, results, fields) => {
      if (err) {
        return next({
          log: 'There was a problem making MySQL database query',
          status: 500,
          message: { err },
        });
      }
      const allTables = {};
      const tables = [];
      for (let i = 0; i < results.length; i++){
        let table = Object.values(results[i])[0];
        allTables[table] = {};
        tables.push(table);
      }
      const columns = [];
      const keys = [];
      for (let i = 0; i < tables.length; i++) {
        let data = await connection.promise().query(`SHOW KEYS FROM ${tables[i]};`)
        let key = data[0];
        allTables[tables[i]].primaryKey = {};
        allTables[tables[i]].foreignKeys = {};
        for (let j = 0; j < key.length; j++) {
          let { Key_name, Column_name } = key[j];
          if (Key_name === 'PRIMARY') {
            allTables[tables[i]].primaryKey = Column_name;
          } else {
            allTables[tables[i]].foreignKeys[Key_name] = {};
            allTables[tables[i]].foreignKeys[Key_name].referenceKey = allTables[tables[i]].primaryKey;
          }
        }
        keys.push(key);
      }
      for (let i = 0; i < tables.length; i++) {
        let data = await connection.promise().query(`SHOW FIELDS FROM ${tables[i]};`)
        let column = data[0];
        allTables[tables[i]].columns = {};
        for (let j = 0; j < column.length; j++) {
          allTables[tables[i]].columns[column[j].Field] = {}
          let { Field, Null } = column[j];
          allTables[tables[i]].columns[column[j].Field].dataType = Field;
          allTables[tables[i]].columns[column[j].Field].isNullable = Null;

        }
        columns.push(column);
      }

      res.locals.tables = allTables;
      // res.locals.fields = fields;
      return next();
    }
  );
};

module.exports = mySQLController;
