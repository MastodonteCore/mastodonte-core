const express = require('express');
const app = express();
const path = require('path');
const scrapingRoutes = require('./routes/scraping');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', scrapingRoutes)

module.exports = app;