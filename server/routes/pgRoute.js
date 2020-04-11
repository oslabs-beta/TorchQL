const router = require('express').Router();
const pgController = require('./../controllers/pgController');

router.get('/pg',
  pgController.getPGTables,
  pgController.makeQueries,
  pgController.makeTypes,
  pgController.makeQueryResolvers,
  pgController.makeMutationResolvers,
  (req, res) => {
    console.log('query resolvers: ', res.locals.queries);
    console.log('mutation resolvers: ', res.locals.mutations);
    res.status(200).json(res.locals.tables);
  }
);

module.exports = router;
