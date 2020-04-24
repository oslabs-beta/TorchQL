const router = require('express').Router();
const pgController = require('../SDL-definedSchemas/controllers/pgController');
const pgProgController = require('../programmatically-definedSchemas/controllers-prog/pg-progController');

router.get(
  '/sdl',
  pgController.getPGTables,
  pgController.assembleSDLSchema,
  (req, res) => {
    console.log(res.locals.schema);
    res.status(200).json(res.locals.tables);
  }
);

router.get('/prog',
  pgController.getPGTables,
  pgProgController.generateQuery,
  pgProgController.formatQueries,
  pgProgController.generateMutations,
  pgProgController.assembleMutations,
  pgProgController.formatMutations,
  pgProgController.combineQueryAndMutations,
  (req, res) => {
    console.log(res.locals.combine)
    res.status(200).json(res.locals.combine);
  }
);

module.exports = router;
