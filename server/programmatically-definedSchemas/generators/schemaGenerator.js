const SchemaGenerator = {};

SchemaGenerator.assembleProgSchema = function assembleProgSchema(obj) {
  const { types, returnQuery , mutations } = obj;
  return 'const {\n'
    + '  GraphQLObjectType,\n'
    + '  GraphQLString,\n'
    + '  GraphQLList,\n'
    + '  GraphQLSchema,\n'
    + '  GraphQLNonNull,\n'
    + `} = require('graphql');\n`
    + `const db = require('../dbConnect');\n\n`
    + `${types}`
    + `${returnQuery}`
    + `${mutations}\n`
    + 'module.exports = new GraphQLSchema({\n'
    + '  query: RootQuery,\n'
    + '  mutation: Mutation,\n'
    + '});'
};

module.exports = SchemaGenerator;