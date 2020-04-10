const router = require('express').Router();
const dbController = require('./../controllers/dbController');

router.get('/pg',
  dbController.getPGTables,
  (req, res) => res.status(200).json(res.locals.tables)
);

module.exports = router;