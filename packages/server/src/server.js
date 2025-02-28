const express = require("express");
const cors = require("cors");
const logger = require("./logger");
const {addBook} = require("./routes/add-book");
const {getBooks} = require("./routes/get-books");

const app = express();
const PORT = Number.parseInt(process.env.PORT || "8081", 10);
const DELAY_MAX_MS = Number.parseInt(process.env.DELAY_MAX_MS || "500", 10);

// hacking for debugging, slow random calls down
const slowdownMiddleware = (req, res, next) => {
    setTimeout(
        () => {
            next();
        },
        DELAY_MAX_MS * Math.random(),
    );
};

// use before any other routes - require preflight for
// all marked CORS requests in this example
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

app.use('/api/*path', cors(corsOptions));

app.use(express.json());

// not realy needed as auto-instrumentation wires up the request logging
app.use((req, res, next) => {
    logger.info({protocol: req.protocol, method: req.method, path: req.path});
    next();
});

// this should slow down any response
app.use(slowdownMiddleware);

// Add a book
app.post('/api/books', addBook);

// Get list of all books
app.get('/api/books', getBooks);

// Centralized error handler
// app.use((err, req, res, next) => {
//     console.error(err); // Log error
//     res.status(err.status || 500).json({ message: 'Internal Server Error', error: err.message });
// });

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = { app, startServer };