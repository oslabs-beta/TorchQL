const router = require('express').Router();
const pgController = require('../SDL-definedSchemas/controllers/pgController');
const pgProgController = require('../programmatically-definedSchemas/controllers-prog/pg-progController');
const mySQLController = require('../SDL-definedSchemas/controllers-SDL/mySQLController');

router.get(
  '/pg-sdl',
  pgController.getPGTables,
  pgController.assembleSDLSchema,
  (req, res) => {
    console.log(res.locals.schema);
    res.status(200).json(res.locals.tables);
  }
);

router.get('/pg-prog',
  pgController.getPGTables,
  pgProgController.generateQuery,
  pgProgController.formatQueries,
  pgProgController.generateMutations,
  pgProgController.assembleMutations,
  pgProgController.formatMutations,
  pgProgController.combineQueryAndMutations,
  (req, res) => {
    console.log(res.locals.mutations)
    res.status(200).json(res.locals.combine);
  }
);

router.get(
  '/mysql-sdl',
  mySQLController.getTables,
  (req, res) => {
    console.log(res.locals.mysqltables)
    res.status(200).json(res.locals.mysqltables);
  }
);

module.exports = router;
