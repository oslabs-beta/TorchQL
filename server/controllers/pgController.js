const fs = require('fs');
const { Pool } = require('pg');
const pgQuery = fs.readFileSync('server/queries/tableData.sql', 'utf8');
const pgController = {};
const { createQuery, createMutation, createTypes, formatTypeDefs } = require('../functions/typesCreator');
const { generateGetAllQuery, generateGetOneQuery, generateQueryResolvers, generateMutationResolvers, formatResolvers } = require('../functions/resolversCreator');

// middleware function for recovering info from pg tables
pgController.getPGTables = (req, res, next) => {
  const db = new Pool({ connectionString: req.body.DB_URI });
  db.query(pgQuery)
    .then((data) => {
      res.locals.tables = data.rows;
      return next();
    })
    .catch((err) =>
      next({
        log: 'There was a problem making database query',
        status: 500,
        message: { err },
      })
    );
};

// middleware function for making query root types in SDL
pgController.makeQueries = (req, res, next) => {
  let queries = createQuery(res.locals.tables);
  res.locals.queries = queries;
  return next();
};

// middleware function for making mutation root types in SDL
pgController.makeMutations = (req, res, next) => {
  let mutations = createMutation(res.locals.tables);
  res.locals.mutations = mutations;
  return next();
}

// middleware function for making custom object types in SDL
pgController.makeTypes = (req, res, next) => {
  const types = createTypes(res.locals.tables);
  res.locals.types = types;
  return next();
};

// middleware function for returning formatted type definitions in SDL as string
pgController.returnTypeDefs = (req, res, next) => {
  const { queries, mutations, types } = res.locals;
  res.locals.allTypeDefs = formatTypeDefs(queries, mutations, types);
  return next();
}

// middleware function for making query resolvers in SDL as string
pgController.makeQueryResolvers = (req, res, next) => {
  const queryAllResolvers = generateGetAllQuery(res.locals.tables);
  const queryOneResolvers = generateGetOneQuery(res.locals.tables);
  res.locals.queryResolvers = generateQueryResolvers(queryAllResolvers, queryOneResolvers);
  return next();
};

// TODO: Fix the commented-out conditional in tablesAndColumns - for some reason these values are undefined when run. They're defined when logged to the console, however.
pgController.makeMutationResolvers = (req, res, next) => {
  const mutationResolvers = generateMutationResolvers(res.locals.tables);
  res.locals.mutationResolvers = mutationResolvers;
  return next();
};

// middleware function for returning formatted resolvers in SDL as string
pgController.returnResolvers = (req, res, next) => {
  const { queryResolvers, mutationResolvers } = res.locals;
  res.locals.resolvers = formatResolvers(queryResolvers, mutationResolvers);
  return next();
}



module.exports = pgController;
