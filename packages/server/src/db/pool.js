const { Pool }  = require('pg');

const { DB_USER, DB_HOST, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

// do 1x - this is cheesy but it is a simple demo
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT 
});

// in effect a singleton
function getPool() {
    return pool;
}

module.exports = { getPool };
