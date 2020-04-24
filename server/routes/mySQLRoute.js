const router = require('express').Router();
const mySQLController = require('../SDL-definedSchemas/controllers-SDL/mySQLController');

router.get(
  '/mysql-sdl',
  mySQLController.getTables,
  (req, res) => {
    console.log(res.locals.mysqltables)
    res.status(200).json(res.locals.mysqltables);
  }
);

module.exports = router;