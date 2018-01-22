const chalk = require('chalk')
const createServer = require('./createServer')
const createWebSocketServer = require('./createWebSocketServer')
const settingsDefault = require('./settingsDefault')
const init = require('./init')

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

  addRoute(routePath, type = 'get', cb) {
    this.routes.push({ routePath, type, cb })
  }

  run () {
    const { app, settings, modules, routes, server } = this

    if (app) {
      routes.forEach(route => attachRoute(route, app))

      modules.forEach(mod => attachModule(mod, app, settings))

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

function attachModule(mod, app, settings) {
  const { appRoute, appModule } = mod

  app.use(appRoute, appModule(settings))
}

module.exports = Core
