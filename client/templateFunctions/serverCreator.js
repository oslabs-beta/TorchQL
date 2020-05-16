function serverCreator() {
  const fileContent = `
  const express = require('express');
  const expressGraphQL = require('express-graphql');
  require('dotenv').config();

  const schema = require('./sdlSchema/schema');
  const app = express();
  const PORT = 3000;

  app.use(
    '/graphql',
    expressGraphQL({
      schema,
      graphiql: true,
    })
  );

  app.listen(PORT, () => {
    console.log('Welcome to TorchQL! To query your database using your new schemas, please go to http://localhost:3000/graphql');
  });
  `;
  return fileContent;
}

module.exports = {
  serverCreator
};
