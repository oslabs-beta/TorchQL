// Root Query 
let rootQuery =
`const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      // GET all users
      ${tableName}: {
        type: new GraphQLList(${singular(tableName)}Type),
        resolve() {
          try {
            const query = 'SELECT * FROM ${tableName}';
            return db.query(query).then((res) => res.rows);
          } catch (err) {
            throw new Error(err);
          }
        },
      },
    }
});`
function getAllQuery(data) {
    
}