const fs = require('fs');
const { Pool } = require('pg');
const { createTypes, formatTypeDefs } = require('./../helpers/typesCreator');
const { createResolvers, combineResolvers } = require('./../helpers/resolversCreator');
const pgQuery = fs.readFileSync('server/queries/tableData.sql', 'utf8');

const pgController = {};

// middleware function for recovering info from pg tables
pgController.getPGTables = (req, res, next) => {
  const db = new Pool({ connectionString: req.query.uri });
  db.query(pgQuery)
    .then((data) => {
      res.locals.tables = data.rows[0].tables;
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

// middleware function for making query and mutation root types in SDL
pgController.createTypes = (req, res, next) => {
  const { queries, mutations, customTypes } = createTypes(res.locals.tables);
  res.locals.queries = queries;
  res.locals.mutations = mutations;
  res.locals.types = customTypes;
  return next();
};

// middleware function for returning formatted type definitions in SDL as string
pgController.returnTypeDefs = (req, res, next) => {
  const { queries, mutations, types } = res.locals;
  res.locals.allTypeDefs = formatTypeDefs(queries, mutations, types);
  return next();
}

// middleware function for creating resolvers in SDL as string
pgController.createResolvers = (req, res, next) => {
  const { queries, mutations }  = createResolvers(res.locals.tables);
  res.locals.queryResolvers = queries;
  res.locals.mutationResolvers = mutations;
  return next();
};

// middleware function for returning formatted resolvers in SDL as string
pgController.combineResolvers = (req, res, next) => {
  const { queryResolvers, mutationResolvers } = res.locals;
  res.locals.resolvers = combineResolvers(queryResolvers, mutationResolvers);
  return next();
}

pgController.assembleSchema = (req, res, next) => {
  const { allTypeDefs, resolvers } = res.locals;
  res.locals.schema = `${allTypeDefs}${resolvers}\n\nconst schema = makeExecutableSchema({\n  typeDefs,\n  resolvers,\n});\n\nmodule.exports = schema;`;
  return next();
}



module.exports = pgController;
