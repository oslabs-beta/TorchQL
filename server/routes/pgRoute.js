const router = require('express').Router();
const pgController = require('./../controllers/pgController');

router.get('/pg', pgController.getPGTables, pgController.makeQueries, pgController.makeTypes, (req, res) => {
  res.status(200).json(res.locals.tables)
});

module.exports = router;