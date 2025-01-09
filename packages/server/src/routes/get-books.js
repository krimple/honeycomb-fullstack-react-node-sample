const {getPool} = require("../db/pool");


const getBooks = async (req, res) => {
   try {
       const pool = getPool();
       // renaming to camelCase for returned data, ibid
        const result = await pool.query(
            `SELECT isbn, name, description, publication_date AS "publicationDate"
             FROM books 
             ORDER BY id ASC`);
        res.json(result.rows);
    } catch (err) {
        console.dir(err);
        console.error(err);
        res.status(err.code).json({ error: 'Internal server error' });
    }
};

module.exports = { getBooks };