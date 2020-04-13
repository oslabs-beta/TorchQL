const router = require('express').Router();
const pgController = require('./../controllers/pgController');

router.get(
  '/pg',
  pgController.getPGTables,
  pgController.makeQueries,
  pgController.makeMutations,
  pgController.makeTypes,
  // pgController.returnTypeDefs,
  // pgController.makeQueryResolvers,
  // pgController.makeMutationResolvers,
  // pgController.returnResolvers,
  (req, res) => {
    // console.log('typedefs: \n', res.locals.allTypeDefs);
    // console.log('resolvers: \n', res.locals.resolvers);
    res.status(200).json(res.locals.tables);
  }
);

module.exports = router;
