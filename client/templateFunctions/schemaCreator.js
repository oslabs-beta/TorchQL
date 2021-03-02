function schemaCreator(str) {
  const fileContent = 
    `const { makeExecutableSchema } = require('graphql-tools');\n`
    +`const db = require('./dbConnect');\n${str}`;
  return fileContent;
}

module.exports = {
  schemaCreator
};