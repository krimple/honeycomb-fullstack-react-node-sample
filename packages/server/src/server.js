const express = require("express");
const cors = require("cors");
const logger = require("./logger");
const router = require("./routes");

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

// this should slow down any response
app.use(slowdownMiddleware);

// add API router
app.use('/api', router);

// Centralized error handler?
app.use((err, req, res, next) => {
    console.error(err); // Log error
    res.status(err.status || 500).json({ message: 'Internal Server Error', error: err.message });
});

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = { app, startServer };
