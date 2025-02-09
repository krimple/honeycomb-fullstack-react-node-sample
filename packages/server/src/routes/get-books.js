const {getPool} = require("../db/pool");
const logger = require("../logger");


const getBooks = async (req, res) => {
    return new Promise(async (resolve) => {
        try {
            const pool = getPool();
            // renaming to camelCase for returned data, ibid
            const result = await pool.query(
                `SELECT isbn, name, description, publication_date AS "publicationDate"
             FROM books 
             ORDER BY id ASC`);
            // every 3rd request slow waaaay down!
            setTimeout(() => {
                res.json(result.rows);
            }, 8500);
        } catch (err) {
            reject();
            logger.error(err);
            res.status(500);
            return;
        }
        resolve();
    });

};

module.exports = { getBooks };