const pgController = {};
const { generateAllQuery, generateOneQuery, generateReturnQueries, formatQueries } = require('../helpers/queryCreator');
const { generateMutations, assembleMutations, formatMutations } = require('../helpers/mutationCreator');
const { generateCustomTypes, assembleCustomTypes } = require('../helpers/typeCreator');
const SchemaGenerator = require('../generators/schemaGenerator');

/* Programatic Middlware */

// Gets the Types and return back as string.
pgController.generateCustomTypes = (req, res, next) => {
  try {
    const typesArr = generateCustomTypes(res.locals.tables);
    res.locals.types = typesArr;
    return next();
  } catch (err) {
    return next({
      log: 'There was a problem generating types',
      status: 500,
      message: { error: 'Problem generating types' },
    });
  }
};

pgController.assembleCustomTypes = (req, res, next) => {
  const types = assembleCustomTypes(res.locals.types);
  res.locals.types = types;
  return next();
};

// Gets the Queries and return back as string.
pgController.generateQuery = (req, res, next) => {
  try{
    const getAllQuery = generateAllQuery(res.locals.tables);
    const getOneQuery = generateOneQuery(res.locals.tables);
    res.locals.returnQuery = generateReturnQueries(getAllQuery, getOneQuery);
    return next();
  } catch(err){
    return next ({
      log: 'There was a problem in the generateQuery middleware',
      status: 400,
      message: { error: 'Problem generating query' }, 
    });
  };
};

pgController.formatQueries = (req, res, next) => {
  const query = formatQueries(res.locals.returnQuery);
  res.locals.returnQuery = query;
  return next();
};


// Generate mutation and returns as string.
pgController.generateMutations = (req, res, next) => {
  try {
    const mutationsArr = generateMutations(res.locals.tables);
    res.locals.mutations = mutationsArr;
    return next();
  } catch (err) {
    return next({
      log: 'There was a problem generating mutations',
      status: 500,
      message: { error: 'Problem generating mutations' },
    });
  }
};

pgController.assembleMutations = (req, res, next) => {
  const mutations = assembleMutations(res.locals.mutations);
  res.locals.mutations = mutations;
  return next();
};

pgController.formatMutations = (req, res, next) => {
  const formattedMutations = formatMutations(res.locals.mutations);
  res.locals.mutations = formattedMutations;
  return next();
};

pgController.assembleProgSchema = (req, res, next) => {
  res.locals.progSchema = SchemaGenerator.assembleProgSchema(res.locals)
  return next();
}



module.exports = pgController;
