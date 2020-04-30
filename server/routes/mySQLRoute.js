const router = require('express').Router();
const mySQLController = require('../SDL-definedSchemas/controllers/mySQLController');
const pgController = require('../SDL-definedSchemas/controllers/pgController');
const pgProgController = require('../programmatically-definedSchemas/controllers-prog/pg-progController');

router.post('/sdl', 
  mySQLController.getTables, 
  pgController.assembleSDLSchema,
  (req, res) => {
    console.log(res.locals.SDLSchema);
    res.status(200).json(res.locals.SDLSchema);
  }
);

router.post('/prog',
  mySQLController.getTables, 
  pgProgController.generateCustomTypes,
  pgProgController.assembleCustomTypes,
  pgProgController.generateQuery,
  pgProgController.formatQueries,
  pgProgController.generateMutations,
  pgProgController.assembleMutations,
  pgProgController.formatMutations,
  pgProgController.assembleProgSchema,
  (req, res) => {
    console.log(res.locals.progSchema);
    res.status(200).json(res.locals.progSchema);
  }
);

module.exports = router;
