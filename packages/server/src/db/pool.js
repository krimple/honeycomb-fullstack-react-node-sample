const { Pool }  = require('pg');

// do 1x - this is cheesy but it is a simple demo
const pool = new Pool({
    user: 'library_user',
    host: 'localhost',
    database: 'library',
    password: 'library_password',
    port: 5432,
});

// in effect a singleton
function getPool() {
    return pool;
}

module.exports = { getPool };
