const express = require("express");
const cors = require("cors");
const generateNonsenseSentence = require("./werds");
const logger = require("./logger");

logger.info("Hello, world!");

const app = express();
const PORT = Number.parseInt(process.env.PORT || "8081", 10);

// use before any other routes - require preflight for
// all CORS requests in this example
// app.options('*', cors());

// not realy needed as auto-instrumentation wires up the request logging
// app.use((req, res, next) => {
//     logger.info({protocol: req.protocol, method: req.method, path: req.path});
//     next();
// });

const slowdownMiddleware = (req, res, next) => {
  logger.info("I feel like a nap...");
  setTimeout(
    () => {
      next();
    },
    8000 * Math.random(),
  );
};
// this should slow down any response by 5 seconds
app.use(slowdownMiddleware);

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:8080',
        'https://localhost:5173'
    ],
    method: ['PUT', 'DELETE'],
    "optionsSuccessStatus": 204,
    "preflightContinue": false,
};

app.use('*', cors(corsOptions));

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