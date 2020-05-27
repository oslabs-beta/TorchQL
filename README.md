<p align="center">
  <img width="50" src="https://github.com/oslabs-beta/TorchQL/blob/dev/torchql.png?raw=true">
  <h1 align="center">TorchQL</h1>
</p>

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/team-reactype/ReacType/pulls)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

# 
A developer tool to generate a GraphQL API from a known relational database.

# 

## What Is TorchQL?
**TorchQL** is an open-source tool to assist developers in the migration from REST APIs to GraphQL.  It facilitates the task of 
exposing a GraphQL API over a relational database. 
In other words, **you can use it to implement GraphQL in your application!**

This developer tool parses through the metadata of all the tables in an existing PostgreSQL or MySQL database to generate and return GraphQL schema and resolvers that work in a GraphQL API.

## How It Works
**TorchQL** uses the metadata extracted from a SQL database to generate GraphQL custom types, queries, mutations, and resolvers.  The schema and resolvers can be returned in either SDL or programmatic format and are downloadable as a single desktop file. For experienced users, **TorchQL** permits the custom editing of schemas and resolvers in the browser prior to download.

Enter your database address in the input box and select either of the following formats for your GraphQL schema and resolvers:
- As Schema Definition Language or **SDL**
- As GraphQLSchema object or **Programmatic**


After entering your information, a new screen should appear displaying all your schema and resolvers properly formatted in a text editor.

**SDL example:**
``` js
const typeDefs = `
  type Query {
    people: [Person!]!
    person(id: Int!): Person!
    films: [Film!]!
    film(id: Int!): Film!
    planets: [Planet!]!
    planet(id: Int!): Planet!
    species: [Species!]!
    speciesByID(id: Int!): Species!
    vessels: [Vessel!]!
    vessel(id: Int!): Vessel!
    starshipSpecs: [StarshipSpec!]!
    starshipSpec(id: Int!): StarshipSpec!
  }

  type Mutation {
    createPerson(
      gender: String,
      height: Int,
      mass: String,
      hair_color: String,
      skin_color: String,
      eye_color: String,
      name: String!,
      birth_year: String,
    ): Person!
    updatePerson(
      gender: String,
      height: Int,
      mass: String,
      hair_color: String,
      skin_color: String,
      eye_color: String,
      name: String!,
      birth_year: String,
    ): Person!
    deletePerson(id: ID!): Person!
```
**Programmatic example:**
``` js
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = require('graphql');
const db = require('../dbConnect');

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    id: { type: GraphQLInt },
    gender: { type: GraphQLString },
    height: { type: GraphQLInt },
    mass: { type: GraphQLString },
    hairColor: { type: GraphQLString },
    skinColor: { type: GraphQLString },
    eyeColor: { type: GraphQLString },
    name: { type: GraphQLString },
    birthYear: { type: GraphQLString },
    pilot: {
      type: PilotType,
      resolve(parent, args) => {
        try {
          const query = 'SELECT * FROM pilots WHERE _id = $1';
          const values = [args._id]
          return db.query(query).then((res) => res.rows)
        } catch (err) {
          throw new Error(err);
        }
      },
    peopleInFilm: {
      type: PeopleInFilmType,
      resolve(parent, args) => {
        try {
          const query = 'SELECT * FROM people_in_films WHERE _id = $1';
          const values = [args._id]
          return db.query(query).then((res) => res.rows)
        } catch (err) {
          throw new Error(err);
        }
      },
  }),
});
```

Click on the **Save File** button to save your formatted schema and resolvers to the desktop.

## How to Run TorchQL:

- **Fork** and **Clone** repository.
- open project directory
- **Install** dependencies

```bash
npm install
```

- run application

```bash
npm start
```

- for development mode

```bash
npm run dev
```
## Contributing
TorchQL is currently in beta release.  We welcome all contributions & pull requests!

## Authors
- **[Eric Tang](https://github.com/edtang44)** - [@edtang44](https://github.com/edtang44)
- **[Jimmy Chen](https://www.linkedin.com/in/jimchn/)** - [@jimchn](https://github.com/jimchn)
- **[Mark Fusco](https://www.linkedin.com/in/mark-fusco-46165a181/)** - [@QuestionMark97](https://github.com/QuestionMark97)
- **[Sara Chang](https://www.linkedin.com/in/sara-chang/)** - [@sarachang530](https://github.com/sarachang530)
- **[Zac Haluza](https://haluza.dev)** - [@zhaluza](https://github.com/zhaluza)

## License
This project is licensed under the MIT License
