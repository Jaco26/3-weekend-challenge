const pg = require('pg');
const Pool = pg.Pool;

const config = {
    database: 'to_do',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 5000,
};

const pool = new Pool(config);

module.exports = pool;