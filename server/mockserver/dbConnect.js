const { Pool } = require('pg');
const PG_URI = 'postgres://kenhgyvo:tmusXooNdnmQ35ja1k8ILimiD5oIj0yn@drona.db.elephantsql.com:5432/kenhgyvo';
const pool = new Pool({ connectionString: PG_URI });

module.exports = {
  query: (text, params, callback) => {
    console.log('Executed query:', text);
    return pool.query(text, params, callback);
  },
};
