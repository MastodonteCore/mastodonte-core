/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const config = require('./package.json');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Configure Nunjucks
 */
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('view engine', 'html');
app.set('layout', path.join(__dirname, './views/layout.html'));
app.use(expressStatusMonitor());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(flash());
app.use(lusca.csrf());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.layout = app.get('layout');
  next();
})
app.use((req, res, next) => {
  res.locals.applications = Object.keys(config.applications);
  next();
})
app.use(express.static(path.join(__dirname, 'public/dist/'), { maxAge: 31557600000 }));

/**
 * Routes
 */
const routes = require('./routes/app')
app.use('/', routes);

/**
 * Init Apps
 */
for(let a in config.applications) {
  let obj = {};
  const appModule = require(config.applications[a]);

  obj[a] = runSafeApplication(a, appModule, app);

  if (!obj[a].get('view engine')) {
    nunjucks.configure([app.get('views'), obj[a].get('views')], {
      autoescape: true,
      express: obj[a]
    });
  }
  app.set('applications', Object.assign({}, app.get('applications'), obj))
  app.use(`/${a}`, obj[a])
}

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;

function runSafeApplication(name, app, args) {
  try {
    return app(args)
  } catch (ex) {
    return console.error(`[!] ${name} must be a function who return an instance app`)
  }
}