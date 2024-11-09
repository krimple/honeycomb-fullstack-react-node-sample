const express = require('express');
const cors = require('cors');
const generateNonsenseSentence = require('./werds');
require('./tracing.js');
const logger = require('./logger');

logger.info('Hello, world!');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    logger.info({protocol: req.protocol, method: req.method, path: req.path});
    next();
});

const slowdownMiddleware = (req, res, next) => {
    logger.info('I feel like a nap...');
    setTimeout(() => {
        next();
        logger.info('...woke up, what happened?')
    }, 1000 * Math.random());
}
// this should slow down any response by 5 seconds
app.use(slowdownMiddleware)
app.use(cors());

app.get('/api/random-message', (req, res) => {
    logger.info('about to handle method /api/random-message');
    res.json({ message: generateNonsenseSentence()});
    logger.info('method /api/random-message handled.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
    
