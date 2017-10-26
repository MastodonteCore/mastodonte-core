const express = require('express');
const app = express();
const path = require('path');
const service = require('./services/pdf');

app.set('service', service);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public/dist'), { maxAge: 31557600000 }));

const pdfRoutes = require('./routes/pdf')(app);
app.use('/', pdfRoutes);

module.exports = app;