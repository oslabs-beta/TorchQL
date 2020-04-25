const router = require('express').Router();
const pgController = require('../SDL-definedSchemas/controllers/pgController');
const pgProgController = require('../programmatically-definedSchemas/controllers-prog/pg-progController');

router.get(
  '/sdl',
  pgController.getPGTables,
  pgController.assembleSDLSchema,
  (req, res) => {
    console.log(res.locals.SDLSchema);
    res.status(200).json(res.locals.SDLSchema);
  }
);

router.get('/prog',
  pgController.getPGTables,
  pgProgController.generateCustomTypes,
  pgProgController.assembleCustomTypes,
  pgProgController.generateQuery,
  pgProgController.formatQueries,
  pgProgController.generateMutations,
  pgProgController.assembleMutations,
  pgProgController.formatMutations,
  pgProgController.combineAllSchema,
  (req, res) => {
    console.log(res.locals.progSchema)
    res.status(200).json(res.locals.progSchema);
  }
);

module.exports = router;
