/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const lusca = require('lusca');
const MongoStore = require('connect-mongo')(expressSession);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');

module.exports = function ({ settings, modules, routes }) { 
  const { host, port, mongodb, session, viewsDir, viewEngine, publicDir,  } = settings
  /**
 * Create Express server.
 */
  const app = express();

  /**
   * Connect to MongoDB.
   */
  mongoose.Promise = global.Promise;
  mongoose.connect(mongodb);
  mongoose.connection.on('error', (err) => {
    console.error(err); // eslint-disable-line no-console
    /* eslint-disable no-console */
    console.log(
      '%s MongoDB connection error. Please make sure MongoDB is running.',
      chalk.red('✗'),
    );
    process.exit();
  });

  /**
   * Express configuration.
   */
  app.set('host', host);
  app.set('port', port);
  app.set('views', viewsDir);
  app.set('view engine', viewEngine);
  app.use(expressStatusMonitor());
  app.use(compression());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(expressValidator());
  app.use(
    expressSession({
      resave: true,
      saveUninitialized: true,
      secret: session,
      store: new MongoStore({
        url: mongodb,
        autoReconnect: true,
        clear_interval: 3600,
      }),
    }),
  );
  app.use(flash());
  app.use(lusca.csrf());
  app.use(lusca.xframe('SAMEORIGIN'));
  app.use(lusca.xssProtection(true));
  app.use(
    express.static(publicDir, { maxAge: 31557600000 }),
  );

  /**
   * Routes
   */

  if (routes && routes !== {}) {
    app.use('/', routes);
  }
  
  if (modules.length > 0) {
    modules.forEach(m => {
      const { appRoute, appModule } = m;

      app.use(appRoute, appModule(settings))
    })
  }

  app.listen(app.get('port'), () => {
    console.log(
      `%s App is running at ${app.get('host')}:%d in %s mode`,
      chalk.green('✓'),
      app.get('port'),
      app.get('env'),
    );
    console.log('  Press CTRL-C to stop\n');
  });

  return app;
};
