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
    console.log('Server listening on 3000');
  });
  `;
  return fileContent;
}

module.exports = {
  serverCreator
};
