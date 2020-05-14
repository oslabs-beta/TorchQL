function dbconnectCreator(uri) {
  const fileContent = `
    const { Pool } = require('pg');
    const PG_URI = '${uri}';
    const pool = new Pool({ connectionString: PG_URI });

    module.exports = {
      query: (text, params, callback) => {
        console.log('Executed query:', text);
        return pool.query(text, params, callback);
      },
    };
    `;
  return fileContent;
}

module.exports = {
  dbconnectCreator
};


