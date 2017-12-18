/**
 * Module dependencies.
 */
import * as express from 'express';
import * as  compression from 'compression';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as nunjucks from 'nunjucks';
import * as logger from 'morgan';
import * as chalk from 'chalk';
import * as errorHandler from 'errorhandler';
import * as lusca from 'lusca';
import * as dotenv from 'dotenv';
import * as connectMongo from 'connect-mongo';
import * as flash from 'express-flash';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as expressValidator from 'express-validator';
import * as expressStatusMonitor from 'express-status-monitor';
const config = require('../package.json');
import * as runSafeModule from './lib/runSafeModule';
import * as attachToExpressModule from './lib/attachToExpressModule';

const MongoStore = connectMongo(session)

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: path.join(__dirname, '../.env.example') });

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', err => {
  console.error(err); // eslint-disable-line no-console
  /* eslint-disable no-console */
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
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
      autoReconnect: true,
      clear_interval: 3600
    })
  })
);
app.use(flash());
app.use(lusca.csrf());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.layout = app.get('layout');
  next();
});
app.use((req, res, next) => {
  res.locals.applications = Object.keys(config.applications);
  next();
});
app.use(express.static(path.join(__dirname, 'public/dist/'), { maxAge: 31557600000 }));

/**
 * Routes
 */
const routes = require('./routes');

app.use('/', routes);

/**
 * Init Apps Modules
 */
const appModules = Object.keys(config.applications);

appModules.forEach(appName => {
  const instanceApp = runSafeModule(appName, config.applications, app);

  attachToExpressModule(app, instanceApp, appName);
});

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