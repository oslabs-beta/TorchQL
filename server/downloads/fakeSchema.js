const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = require('graphql');
const db = require('../dbConnect');

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: { type: GraphQLInt },
    body: { type: GraphQLInt },
    publishDate: { type: GraphQLInt },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLInt },
    title: { type: GraphQLInt },
    body: { type: GraphQLInt },
    publishDate: { type: GraphQLInt },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    firstName: { type: GraphQLInt },
    lastName: { type: GraphQLInt },
    email: { type: GraphQLInt },
    password: { type: GraphQLInt },
    location: { type: GraphQLInt },
    dept: { type: GraphQLInt },
    isAdmin: { type: GraphQLInt },
    registerDate: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    comments: {
      type: CommentType,
      resolve() { 
        try { 
          const query = `SELECT * FROM comments`
          return db.query(query).then((res) => res.rows);
        } catch (err){
          throw new Error(err);
        },
      },
    },
 
    commentById: {
      type: CommentType,
      args: {
        id: { type: GraphQLInt },
      },
      resolver(parent, args) {
        try {
          const query = 'SELECT * FROM comments
          WHERE id = $1';
          const values = [args.id];
          return db.query(query, values).then((res) => res.rows[0]);
        } catch (err) {
          throw new Error(err);
        }
      },
    },

    posts: {
      type: PostType,
      resolve() { 
        try { 
          const query = `SELECT * FROM posts`
          return db.query(query).then((res) => res.rows);
        } catch (err){
          throw new Error(err);
        },
      },
    },
 
    postById: {
      type: PostType,
      args: {
        id: { type: GraphQLInt },
      },
      resolver(parent, args) {
        try {
          const query = 'SELECT * FROM posts
          WHERE id = $1';
          const values = [args.id];
          return db.query(query, values).then((res) => res.rows[0]);
        } catch (err) {
          throw new Error(err);
        }
      },
    },

    users: {
      type: UserType,
      resolve() { 
        try { 
          const query = `SELECT * FROM users`
          return db.query(query).then((res) => res.rows);
        } catch (err){
          throw new Error(err);
        },
      },
    },
 
    userById: {
      type: UserType,
      args: {
        id: { type: GraphQLInt },
      },
      resolver(parent, args) {
        try {
          const query = 'SELECT * FROM users
          WHERE id = $1';
          const values = [args.id];
          return db.query(query, values).then((res) => res.rows[0]);
        } catch (err) {
          throw new Error(err);
        }
      },
    },

const Mutation = new GraphQL ObjectType({
  name: 'Mutation',
  fields: {
    addComment: {
      type: CommentType,
      args: {
        body: { type: GraphQLInt },
        publish_date: { type: GraphQLInt },
      },
      resolve(parent, args) {
        try {
          const query = `INSERT INTO comments(body, publish_date)
          VALUES($1, $2)`
          const values = [args.body, args.publish_date]
          return db.query(query, values).then((res) => res.rows[0]);
        } catch(err) {
          throw new Error(err);
        }
      },
    },

    updateComment: {
      type: CommentType,
      args: {
        body: { type: GraphQLInt },
        publish_date: { type: GraphQLInt },
      },
      resolve(parent, args) {
        try { 
          const query = `UPDATE comments
          SET post_id=$1 user_id=$2 `
          WHERE id = $3
          const values = [args.post_id, args.user_id, args.id]
          return db.query(query, values).then((res) => res.rows[0]);
        } catch(err) {
          throw new Error(err);
        }
      },
    },

    deleteComment: {
      type: CommentType,
      args: {
        id: { type: newGraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        try {
          const query = `DELETE FROM comments
          WHERE id = $1`;
          const values = [args.id]
          return db.query(query, values).then((res) => res.rows[0]);
        } catch(err) {
          throw new Error(err)
        }
      },
    },

    addPost: {
      type: PostType,
      args: {
        title: { type: GraphQLInt },
        body: { type: GraphQLInt },
        publish_date: { type: GraphQLInt },
      },
      resolve(parent, args) {
        try {
          const query = `INSERT INTO posts(title, body, publish_date)
          VALUES($1, $2, $3)`
          const values = [args.title, args.body, args.publish_date]
          return db.query(query, values).then((res) => res.rows[0]);
        } catch(err) {
          throw new Error(err);
        }
      },
    },

    updatePost: {
      type: PostType,
      args: {
        title: { type: GraphQLInt },
        body: { type: GraphQLInt },
        publish_date: { type: GraphQLInt },
      },
      resolve(parent, args) {
        try { 
          const query = `UPDATE posts
          SET user_id=$1 body=$2 publish_date=$3 `
          WHERE id = $4
          const values = [args.user_id, args.body, args.publish_date, args.id]
          return db.query(query, values).then((res) => res.rows[0]);
        } catch(err) {
          throw new Error(err);
        }
      },
    },

    deletePost: {
      type: PostType,
      args: {
        id: { type: newGraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        try {
          const query = `DELETE FROM posts
          WHERE id = $1`;
          const values = [args.id]
          return db.query(query, values).then((res) => res.rows[0]);
        } catch(err) {
          throw new Error(err)
        }
      },
    },

    addUser: {
      type: UserType,
      args: {
        first_name: { type: GraphQLInt },
        last_name: { type: GraphQLInt },
        email: { type: GraphQLInt },
        password: { type: GraphQLInt },
        location: { type: GraphQLInt },
        dept: { type: GraphQLInt },
        is_admin: { type: GraphQLInt },
        register_date: { type: GraphQLInt },
      },
      resolve(parent, args) {
        try {
          const query = `INSERT INTO users(first_name, last_name, email, password, location, dept, is_admin, register_date)
          VALUES($1, $2, $3, $4, $5, $6, $7, $8)`
          const values = [args.first_name, args.last_name, args.email, args.password, args.location, args.dept, args.is_admin, args.register_date]
          return db.query(query, values).then((res) => res.rows[0]);
        } catch(err) {
          throw new Error(err);
        }
      },
    },

    updateUser: {
      type: UserType,
      args: {
        first_name: { type: GraphQLInt },
        last_name: { type: GraphQLInt },
        email: { type: GraphQLInt },
        password: { type: GraphQLInt },
        location: { type: GraphQLInt },
        dept: { type: GraphQLInt },
        is_admin: { type: GraphQLInt },
        register_date: { type: GraphQLInt },
      },
      resolve(parent, args) {
        try { 
          const query = `UPDATE users
          SET first_name=$1 last_name=$2 email=$3 password=$4 location=$5 dept=$6 is_admin=$7 register_date=$8 `
          WHERE id = $9
          const values = [args.first_name, args.last_name, args.email, args.password, args.location, args.dept, args.is_admin, args.register_date, args.id]
          return db.query(query, values).then((res) => res.rows[0]);
        } catch(err) {
          throw new Error(err);
        }
      },
    },

    deleteUser: {
      type: UserType,
      args: {
        id: { type: newGraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        try {
          const query = `DELETE FROM users
          WHERE id = $1`;
          const values = [args.id]
          return db.query(query, values).then((res) => res.rows[0]);
        } catch(err) {
          throw new Error(err)
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});