function packagejsonCreator() {
  const fileContent = `
  {
    "name": "torchql",
    "version": "1.0.0",
    "description": "Schema and Resolver Creator for GraphQL API",
    "main": "server.js",
    "scripts": {
      "start": "nodemon server/server.js"
    },
    "author": "Sara Chang, Jimmy Chen, Mark Fusco, Zac Haluza, Eric Tang",
    "license": "NIH",
    "dependencies": {
      "dotenv": "^8.2.0",
      "express": "^4.17.1",
      "express-graphql": "^0.9.0",
      "graphql": "^15.0.0",
      "graphql-playground-middleware-express": "^1.7.15",
      "graphql-tools": "^4.0.7",
      "pg": "^8.0.0"
    },
    "devDependencies": {
      "nodemon": "^2.0.3"
    }
  }`;
  return fileContent;
}

module.exports = {
  packagejsonCreator
};


