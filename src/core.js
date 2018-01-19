const chalk = require('chalk')
const addService = require('./addService')
const createServer = require('./createServer')
const createWebSocketServer = require('./createWebSocketServer')
const init = require('./init')

const settingsDefault = {
  host: '0.0.0.0',
  port: 8000,
  mongodb: 'mongodb://localhost:27017/test',
  session: 'Your Session Secret goes here',
  ssl: {},
  viewsDir: 'views',
  viewEngine: 'html',
  publicDir: 'public',
  services: {},
  ws: false,
  addService
}

class Core {
  constructor (settings) {
    this.settings = Object.assign({}, settingsDefault, settings)
    this.app = init(this.settings)
    this.server = createServer(this.app, this.settings.ssl)

    if (this.settings.ws) {
      this.wss = createWebSocketServer(this.server)
    }

    this.modules = []
    this.routes = []
  }

  add (appName, appModule) {
    const { modules } = this

    if (modules) {
      modules.push({
        appRoute: `/${appName}`,
        appModule
      })
    }
  }

  addRoute (type = 'get', routePath, cb) {
    this.routes.push({ type, routePath, cb })
  }

  run () {
    const { app, settings, modules, routes, server } = this

    if (app) {
      routes.forEach(route => attachRoute(route, app))

      modules.forEach(mod => attachModule(mod, app))

      server.listen(app.get('port'), () => {
        console.log(
          `%s App is running at ${app.get('host')}:%d in %s mode`,
          chalk.green('✓'),
          app.get('port'),
          app.get('env')
        )
        console.log('  Press CTRL-C to stop\n')
      })
    }
  }
}

function attachRoute(route, app) {
  const { type, routePath, cb } = route

  app[type](routePath, cb)
}

function attachModule(mod, app) {
  const { appRoute, appModule } = mod

  app.use(appRoute, appModule(settings))
}

module.exports = Core
