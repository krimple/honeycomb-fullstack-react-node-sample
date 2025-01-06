const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const logger = require("./logger");
const { Pool }  = require('pg');

logger.info("Hello, world!");

const app = express();
const PORT = Number.parseInt(process.env.PORT || "8081", 10);

// PostgreSQL connection pool
const pool = new Pool({
    user: 'library_user',
    host: 'postgres',
    database: 'library',
    password: 'library_password',
    port: 5432,

});

// use before any other routes - require preflight for
// all CORS requests in this example

// not realy needed as auto-instrumentation wires up the request logging
app.use((req, res, next) => {
    logger.info({protocol: req.protocol, method: req.method, path: req.path});
    next();
});

app.use(bodyParser.json());

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:8080',
        'https://localhost:5173'
    ],
    method: ['GET', 'PUT', 'POST', 'DELETE'],
    "optionsSuccessStatus": 204,
    "preflightContinue": false,
};

app.use('*', cors(corsOptions));

// Add a book
app.post('/api/books', async (req, res) => {
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
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get list of all books
app.get('/api/books', async (req, res) => {
    try {
        // renaming to camelCase for returned data, ibid
        const result = await pool.query(
            `SELECT isbn, name, description, publication_date AS "publicationDate"
             FROM books 
             ORDER BY id ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const slowdownMiddleware = (req, res, next) => {
  logger.info("I feel like a nap...");
  setTimeout(
    () => {
      next();
    },
    800 * Math.random(),
  );
};

// this should slow down any response by 5 seconds
// app.use(slowdownMiddleware);

app.post("/api/random-message", cors(corsOptions), (req, res) => {
  logger.info("about to handle method /api/random-message");
  res.json({ message: generateNonsenseSentence() });
  logger.info("method /api/random-message handled.");
});

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = { app, startServer };