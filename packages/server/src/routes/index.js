const express = require('express');

const router = express.Router();

const {getPool} = require("../db/pool");
const logger = require("../logger");
const pool = getPool();
router.post('/books', async (req, res, next) => {
    const { isbn, name, description, publicationDate } = req.body;
    if (req.isbn === 'boom!') {
        throw new Error('This is an invalid code branch!');
    }
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
        next(new Error({
            status: 422,
            message: 'Unexpected database error'
        }));
    }
});

router.get('/books', async (req, res, next) => {
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
 });

 module.exports = router;
