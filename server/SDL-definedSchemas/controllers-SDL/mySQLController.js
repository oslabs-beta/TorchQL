const mysql = require('mysql');
const fs = require('fs');
const mySQLController = {};

mySQLController.getTables = (req, res, next) => {
  const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'eric',
    password : '123456',
    database : 'acme'
  })
  db.connect(err => {
    if (err) {
      console.error('An error occurred while connecting to the DB')
      throw err
    }
    console.log('connection successful')
    const sql = `SHOW fields from users`;
    // const pgQuery = fs.readFileSync('server/queries/mySQLtableData.sql', 'utf8');
    // db.query(sql)
    // .then((data) => {
    //   res.locals.mysqltables = data.rows[0].tables;
    //   return next();
    // })
    // .catch((err) =>
    //   next({
    //     log: 'There was a problem making database query',
    //     status: 500,
    //     message: { err },
    //   })
    // );
    db.query(sql, (err, data) => {
      if(err) throw err;
      res.locals.mysqltables = data;
      return next();
    });
  })
}

module.exports = mySQLController;