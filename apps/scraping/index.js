const express = require('express');
const app = express();
const path = require('path');
const service = require('./services/scraping');
const model = require('./models/Scrap');

app.set('model', model);
app.set('service', service);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public/dist'), { maxAge: 31557600000 }));

const routes = require('./routes/scraping')(app);
app.use('/', routes)

module.exports = app;