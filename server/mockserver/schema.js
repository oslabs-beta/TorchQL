const { makeExecutableSchema } = require('graphql-tools');
const db = require('./dbConnect');
const typeDefs = `
  type Query {
    users: [User!]!
    user(_id: Int!): User!
    documents: [Document!]!
    document(_id: Int!): Document!
  }

  type Mutation {
    createUser(
      username: String!,
      password: String!,
      _id: Int!,
    ): User!
    updateUser(
      username: String!,
      password: String!,
      _id: Int!,
    ): User!
    deleteUser(id: ID!): User!

    createDocument(
      text: String!,
      _id: Int!,
    ): Document!
    updateDocument(
      text: String!,
      _id: Int!,
    ): Document!
    deleteDocument(id: ID!): Document!

  }

  type User {
    _id: Int!
    username: String!
    password: String!
  }

  type Document {
    _id: Int!
    text: String!
  }

`;

const resolvers = {
  Query: {    
    user: (parent, args) => {
      try{
        const query = 'SELECT * FROM users WHERE _id = $1';
        const values = [args._id];
        return db.query(query, values).then((res) => res.rows[0]);
      } catch (err) {
        throw new Error(err);
      }
    },
    users: () => {
      try {
        const query = 'SELECT * FROM users';
        return db.query(query).then((res) => res.rows);
      } catch (err) {
        throw new Error(err);
      }
    },
    document: (parent, args) => {
      try{
        const query = 'SELECT * FROM documents WHERE _id = $1';
        const values = [args._id];
        return db.query(query, values).then((res) => res.rows[0]);
      } catch (err) {
        throw new Error(err);
      }
    },
    documents: () => {
      try {
        const query = 'SELECT * FROM documents';
        return db.query(query).then((res) => res.rows);
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    createUser: (parent, args) => {
      const query = 'INSERT INTO users(username, password) VALUES($1, $2)';
      const values = [args.username, args.password];
      try {
        return db.query(query, values);
      } catch (err) {
        throw new Error(err);
      }
    },
    updateUser: (parent, args) => {
      try {
        const query = 'UPDATE users SET username=$1 password=$2  WHERE _id = $3';
        const values = [args.username, args.password, args._id];
        return db.query(query).then((res) => res.rows);
      } catch (err) {
        throw new Error(err);
      }
    },
    deleteUser: (parent, args) => {
      try {
        const query = 'DELETE FROM users WHERE _id = $1';
        const values = [args._id];
        return db.query(query).then((res) => res.rows);
      } catch (err) {
        throw new Error(err);
      }
    },

    createDocument: (parent, args) => {
      const query = 'INSERT INTO documents(text) VALUES($1)';
      const values = [args.text];
      try {
        return db.query(query, values);
      } catch (err) {
        throw new Error(err);
      }
    },
    updateDocument: (parent, args) => {
      try {
        const query = 'UPDATE documents SET text=$1  WHERE _id = $2';
        const values = [args.text, args._id];
        return db.query(query).then((res) => res.rows);
      } catch (err) {
        throw new Error(err);
      }
    },
    deleteDocument: (parent, args) => {
      try {
        const query = 'DELETE FROM documents WHERE _id = $1';
        const values = [args._id];
        return db.query(query).then((res) => res.rows);
      } catch (err) {
        throw new Error(err);
      }
    },

  },
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;