require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const articlesRoutes = require('../routes/articles');
const { errorHandler } = require('../controllers/errorHandler');

const app = express();

const morganOption = (NODE_ENV === 'production' ? 'tiny' : 'common');

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(errorHandler);

app.use('/api/articles', articlesRoutes);

app.get('/', (req, res) => {
    res.status(200).send('Hello, boilerplate!');
})

module.exports = app;