const {getPool} = require("../db/pool");
const logger = require("../logger");


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
        logger.error(err);
        res.status(500);
    }
};

module.exports = { getBooks };