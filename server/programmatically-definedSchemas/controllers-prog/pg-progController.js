const pgController = {};
const { generateAllQuery, generateOneQuery, generateResolvers } = require('../helpers/queryCreator');

/* Programatic Middlware */
pgController.makeProgQueryResolvers = (req, res, next) => {
    const allQueryResolvers = generateAllQuery(res.locals.tables);
    const oneQueryResolvers = generateOneQuery(res.locals.tables);
    return next();
  };

module.exports = pgController;
