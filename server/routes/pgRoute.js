const router = require('express').Router();
const pgController = require('../SDL-definedSchemas/controllers/pgController');
const pgProgController = require('../programmatically-definedSchemas/controllers-prog/pg-progController');

router.get(
  '/sdl',
  pgController.getPGTables,
  pgController.assembleSDLSchema,
  (req, res) => {
    console.log(res.locals.SDLSchema);
    res.status(200).json(res.locals.tables);
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
  pgProgController.assembleProgSchema,
  (req, res) => {
    console.log(res.locals.mutations)
    res.status(200).json(res.locals.tables);
  }
);

module.exports = router;
