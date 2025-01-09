const {getPool} = require("../db/pool");
const pool = getPool();
const addBook = async (req, res) => {
    const { isbn, name, description, publicationDate } = req.body;
    try {
        const pool = getPool();
        // note the conversion of camel to snake case in the statement below. Could make systemic
        // but hey, I'm not trying to slay dragons
        const result = await pool.query(
            `INSERT INTO books (isbn, name, description, publication_date) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [isbn, name, description, publicationDate]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { addBook };