const express = require('express');
const app = express();
const path = require('path');
const accountRoutes = require('./routes/account');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', accountRoutes)

module.exports = app;