const router = require('express').Router();
const pgController = require('../SDL-definedSchemas/controllers-SDL/pgController');
const pgProgController = require('../programmatically-definedSchemas/controllers-prog/pg-progController');

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
module.exports = router;
