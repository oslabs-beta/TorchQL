const router = require('express').Router();
const mySQLController = require('../SDL-definedSchemas/controllers/mySQLController');
const pgController = require('../SDL-definedSchemas/controllers/pgController');

router.get('/sdl', 
  mySQLController.getTables, 
  pgController.assembleSDLSchema,
  (req, res) => {
    console.log(res.locals.SDLSchema);
    res.status(200).json(res.locals.SDLSchema);
  }
);

module.exports = router;
