const express = require('express');
global.accountApp = express();
const path = require('path');
const accountRoutes = require('./routes/account');
const passport = require('passport');

accountApp.set('views', path.join(__dirname, 'views'));
accountApp.set('view engine', 'pug');
accountApp.use(passport.initialize());
accountApp.use(passport.session());
accountApp.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
accountApp.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
    req.path === '/account') {
    req.session.returnTo = req.path;
  }
  next();
});

accountApp.use('/', accountRoutes)

module.exports = accountApp;