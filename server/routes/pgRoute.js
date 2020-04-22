const router = require('express').Router();
const pgController = require('./../controllers/pgController');

router.get('/pg',
  pgController.getPGTables,
  pgController.createTypes,
  pgController.returnTypeDefs,
  pgController.createResolvers,
  pgController.combineResolvers,
  pgController.assembleSchema,
  (req, res) => {
    console.log(res.locals.schema);
    res.status(200).json(res.locals.tables);
  }
);

module.exports = router;
