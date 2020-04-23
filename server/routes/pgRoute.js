const router = require('express').Router();
const pgController = require('../SDL-definedSchemas/controllers-SDL/pgController');
const pgProgController = require('../programmatically-definedSchemas/controllers-prog/pg-progController');
const mySQLController = require('../SDL-definedSchemas/controllers-SDL/mySQLController');
// const mongoController = require('../SDL-definedSchemas/controllers-SDL/mongoController');

router.get(
  '/pg-sdl',
  pgController.getPGTables,
  pgController.makeQueries,
  pgController.makeMutations,
  pgController.makeTypes,
  pgController.returnTypeDefs,
  pgController.makeQueryResolvers,
  pgController.makeMutationResolvers,
  pgController.returnResolvers,
  pgController.assembleSchema,
  (req, res) => {
    console.log(res.locals.schema);
    res.status(200).json(res.locals.schema);
  }
);

router.get('/pg-prog',
  mySQLController.getTables,
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

// router.get('/mongo-sdl',
//   mongoController.getCollections,
//   (req, res) => {
//     console.log(res.locals.mongo);
//     res.status(200).json(res.locals.mongo);
//   }
// );

module.exports = router;
