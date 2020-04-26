const router = require('express').Router();
const mySQLController = require('../SDL-definedSchemas/controllers/mySQLController');

router.get('/sdl', mySQLController.getTables, (req, res) => {
  console.log(res.locals.tables);
  res.status(200).json(res.locals.tables);
});

module.exports = router;
