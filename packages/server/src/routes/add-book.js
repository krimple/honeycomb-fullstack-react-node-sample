const {getPool} = require("../db/pool");
const logger = require("../logger");
const pool = getPool();
const addBook = async (req, res) => {
    const { isbn, name, description, publicationDate } = req.body;
    try {
        // note the conversion of camel to snake case in the statement below. Could make systemic
        // but hey, I'm not trying to slay dragons
        const result = await pool.query(
            `INSERT INTO books (isbn, name, description, publication_date) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [isbn, name, description, publicationDate]
        );
        res.json(result.rows[0]);
    } catch (err) {
        logger.error('Database error:', err.message);
        // TODO - better error handling with Express. This just swallows the actual error stack trace, ncluding
        // violations, etc. You'd need a logical validation error handler to fix this.
        res.status(422);
    }
}

module.exports = { addBook };