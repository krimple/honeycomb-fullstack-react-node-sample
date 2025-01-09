const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const logger = require("./logger");
const {addBook} = require("./routes/add-book");
const {getBooks} = require("./routes/get-books");

// logger.info("Hello, world!");

const app = express();
const PORT = Number.parseInt(process.env.PORT || "8081", 10);
const DELAY_MAX_MS = Number.parseInt(process.env.DELAY_MAX_MS || "500", 10);

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
app.post('/api/books', addBook);

// Get list of all books
app.get('/api/books', getBooks);

const slowdownMiddleware = (req, res, next) => {
  setTimeout(
    () => {
      next();
    },
    DELAY_MAX_MS * Math.random(),
  );
};

// this should slow down any response
app.use(slowdownMiddleware);

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