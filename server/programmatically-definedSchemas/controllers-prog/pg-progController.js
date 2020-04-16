const pgController = {};
const { generateAllQuery, generateOneQuery, generateResolvers } = require('../helpers/queryCreator');

/* Programatic Middlware */
pgController.makeProgQueryResolvers = (req, res, next) => {
    const getAllQuery = generateAllQuery(res.locals.tables);
    const getOneQuery = generateOneQuery(res.locals.tables);
    return next();
  };

module.exports = pgController;
