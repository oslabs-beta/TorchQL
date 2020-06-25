function serverCreator() {
  const fileContent = `
  const express = require('express');
  const expressGraphQL = require('express-graphql');
  require('dotenv').config();
  const expressPlayground = require('graphql-playground-middleware-express').default;

  const schema = require('./sdlSchema/schema');
  const app = express();
  const PORT = 3000;

  app.use(
    '/graphql',
    expressGraphQL({
      schema
    })
  );

  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

  app.listen(PORT, () => {
    console.log('Welcome to TorchQL! To query your database using your new schemas, please go to http://localhost:3000/playground');
  });
  `;
  return fileContent;
}

module.exports = {
  serverCreator
};
