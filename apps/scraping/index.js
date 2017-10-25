const express = require('express');
global.scrapingApp = express();
const path = require('path');
const scrapingRoutes = require('./routes/scraping');

scrapingApp.set('views', path.join(__dirname, 'views'));
scrapingApp.set('view engine', 'pug');
scrapingApp.use(express.static(path.join(__dirname, 'public/dist'), { maxAge: 31557600000 }));

scrapingApp.use('/', scrapingRoutes)

module.exports = scrapingApp;