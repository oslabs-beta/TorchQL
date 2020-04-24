const express = require('express');
const pgRouter = require('./routes/pgRoute');
const mySQLRouter = require('./routes/mySQLRoute');
const app = express();
const PORT = 3000;

/* Express logic/handler */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/db/pg', pgRouter);
app.use('/db/mySQL', mySQLRouter);

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'An error occured in unknown middleware',
    status: 500,
    message: { err: 'An error ocurred' },
  };
  const errObj = { ...defaultErr, ...err };
  console.log(errObj.log);
  res.status(errObj.status).json(errObj.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;
