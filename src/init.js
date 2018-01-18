/**
 * Module dependencies.
 */
const express = require('express')
const compression = require('compression')
const expressSession = require('express-session')
const bodyParser = require('body-parser')
const logger = require('morgan')
const chalk = require('chalk')
const lusca = require('lusca')
const MongoStore = require('connect-mongo')(expressSession)
const flash = require('express-flash')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const expressStatusMonitor = require('express-status-monitor')

module.exports = function (settings) {
  const { host, port, mongodb, session, viewsDir, viewEngine, publicDir } = settings
  const sessionConfigDefault = {
    resave: true,
    saveUninitialized: true,
    secret: session
  }
  /**
 * Create Express server.
 */
  const app = express()

  if (mongodb) {
    /**
     * Connect to MongoDB.
     */
    mongoose.Promise = global.Promise
    mongoose.connect(mongodb)
    mongoose.connection.on('error', (err) => {
      console.error(err)
      console.log(
        '%s MongoDB connection error. Please make sure MongoDB is running.',
        chalk.red('✗')
      )
      process.exit()
    })
  }

  /**
   * Express configuration.
   */
  app.set('host', host)
  app.set('port', port)
  app.set('views', viewsDir)
  app.set('view engine', viewEngine)
  app.use(expressStatusMonitor())
  app.use(compression())
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(expressValidator())
  app.use(
    expressSession((mongodb) ? Object.assign({}, sessionConfigDefault, {
      store: new MongoStore({
        url: mongodb,
        autoReconnect: true,
        clear_interval: 3600
      })
    }) : sessionConfigDefault)
  )
  app.use(flash())
  app.use(lusca.csrf())
  app.use(lusca.xframe('SAMEORIGIN'))
  app.use(lusca.xssProtection(true))
  app.use(
    express.static(publicDir, { maxAge: 31557600000 })
  )

  return app
}
