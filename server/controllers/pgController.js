const fs = require('fs');
const { Pool } = require('pg');
const TypeGenerator = require('../generators/typeGenerator');
const ResolverGenerator = require('../generators/resolverGenerator');
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
        log: err,
        status: 500,
        message: { err: 'There was a problem making database query' },
      })
    );
};

// middleware function for making query and mutation root types in SDL
pgController.createTypes = (req, res, next) => {
  try {
    const { tables } = res.locals;
    let queries = '';
    let mutations = '';
    let customTypes = '';
    for (let tableName in tables) {
      queries += TypeGenerator.queries(tableName);
      mutations += TypeGenerator.mutations(tableName, tables[tableName]);
      customTypes += TypeGenerator.customTypes(tableName, tables);
    }
    res.locals.types = 'const typeDefs = `\n'
      + '  type Query {\n'
      + `    ${queries}\n`
      + '  }\n\n'
      + '  type Mutation {\n'
      + `    ${mutations}\n`
      + '  }\n\n'
      + `${customTypes}\`;\n\n`;
    return next();
  } catch (err) {
    return next({
      log: err,
      status: 500,
      message: { err: 'There was a problem creating types' }
    });
  }
};

// middleware function for creating resolvers in SDL as string
pgController.createResolvers = (req, res, next) => {
  try {
    const { tables } = res.locals;
    let queries = '';
    let mutations = '';
    for (tableName in tables) {
      const { primaryKey } = tables[tableName];
      const tableData = tables[tableName];
      queries += ResolverGenerator.queries(tableName, primaryKey);
      mutations += ResolverGenerator.mutations(tableName, tableData)
    }
    res.locals.resolvers = 'const resolvers = {\n'
      + '  Query: {'
      + `    ${queries}\n`
      + '  }\n\n'
      + '  Mutation: {\n'
      + `${mutations}`
      + '  }\n'
      + '}\n';
    return next();
  } catch (err) {
    return next({
      log: err,
      status: 500,
      message: { err: 'There was a problem creating resolvers' }
    });
  }
};

pgController.assembleSchema = (req, res, next) => {
  try {
    const { types, resolvers } = res.locals;
    res.locals.schema = `${types}${resolvers}\n\nconst schema = makeExecutableSchema({\n  typeDefs,\n  resolvers,\n});\n\nmodule.exports = schema;`;
    return next();
  } catch (err) {
    return next({
      log: err,
      status: 500,
      message: { err: 'There was a problem assembling SDL schema' }
    });
  }
}

module.exports = pgController;
