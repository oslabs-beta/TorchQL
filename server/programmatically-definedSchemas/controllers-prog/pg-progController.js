const pgController = {};
const { generateAllQuery, generateOneQuery, generateReturnQueries } = require('../helpers/queryCreator');

/* Programatic Middlware */
pgController.makeProgQueryResolvers = (req, res, next) => {
    const getAllQuery = generateAllQuery(res.locals.tables);
    const getOneQuery = generateOneQuery(res.locals.tables);
    res.locals.returnQuery = generateReturnQueries(getAllQuery, getOneQuery);
    return next();
  };

module.exports = pgController;
