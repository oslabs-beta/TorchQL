const express = require('express');
const dbRouter = require('./routes/pgRoute');
const app = express();
const PORT = 3000;

/* Express logic/handler */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/db', dbRouter);

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
