const router = require('express').Router();
const pgController = require('./../controllers/pgController');

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

router.get(
  '/pg-prog',

  pgController.getPGTables,
  pgController.generateMutations,
  pgController.assembleMutations,
  pgController.formatMutations,
  (req, res) => {
    res.status(200).json(res.locals.mutations);
  }
);

module.exports = router;
