const router = require('express').Router();
const pgController = require('./../controllers/pgController');

router.get('/pg',
  pgController.getPGTables,
  pgController.makeQueries,
  pgController.makeMutations,
  pgController.makeTypes,
  pgController.returnTypeDefs,
  pgController.makeQueryResolvers,
  pgController.makeMutationResolvers,
  (req, res) => {
    console.log('mutation resolvers: ', res.locals.mutationResolvers);
    res.status(200).json(res.locals.tables);
  }
);

module.exports = router;
