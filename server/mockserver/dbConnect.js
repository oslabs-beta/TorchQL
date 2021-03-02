const { Pool } = require('pg');
const PG_URI = 'postgres://imvgunqg:NZ7GfBlp74-04PTho1XetRNgaOPgTDXi@drona.db.elephantsql.com:5432/imvgunqg';
const pool = new Pool({ connectionString: PG_URI });

module.exports = {
  query: (text, params, callback) => {
    console.log('Executed query:', text);
    return pool.query(text, params, callback);
  },
};
