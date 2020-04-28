const TypeGenerator = require('../generators/typeGenerator');
const ResolverGenerator = require('../generators/resolverGenerator');

const SchemaGenerator = {};
// assembles all programmatic schema and resolvers together in one string
SchemaGenerator.assembleSchema = function assembleSchema(tables) {
  let queryType = '';
  let mutationType = '';
  let customTypes = '';
  let queryResolvers = '';
  let mutationResolvers = '';
  let relationshipResolvers = '';
  for (let tableName in tables) {
    const tableData = tables[tableName];
    const { foreignKeys, columns } = tableData;
    queryType += TypeGenerator.queries(tableName, tableData);
    mutationType += TypeGenerator.mutations(tableName, tableData);
    customTypes += TypeGenerator.customTypes(tableName, tables);
    if (!foreignKeys || Object.keys(columns).length !== Object.keys(foreignKeys).length + 1) {
      queryResolvers += ResolverGenerator.queries(tableName, tableData);
      mutationResolvers += ResolverGenerator.mutations(tableName, tableData);
      relationshipResolvers += ResolverGenerator.getRelationships(tableName, tables);
    }
  }
  return 'const typeDefs = `\n'
    + '  type Query {\n'
    + queryType
    + '  }\n\n'
    + '  type Mutation {\n'
    + mutationType
    + '  }\n\n'
    + `${customTypes}\`;\n\n`
    + 'const resolvers = {\n'
    + '  Query: {'
    + `    ${queryResolvers}\n`
    + '  },\n\n'
    + '  Mutation: {\n'
    + mutationResolvers
    + '  },\n'
    + relationshipResolvers
    + '}\n\n'
    + 'const schema = makeExecutableSchema({\n'
    + '  typeDefs,\n'
    + '  resolvers,\n'
    + '});\n\n'
    + 'module.exports = schema;';
};

module.exports = SchemaGenerator;