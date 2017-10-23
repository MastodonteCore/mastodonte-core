const express = require('express');
const app = express();
const path = require('path');
const pdfRoutes = require('./routes/pdf');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', pdfRoutes)

module.exports = app;