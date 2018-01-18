const chalk = require('chalk')
const addService = require('./addService')
const init = require('./init')

const settingsDefault = {
  host: '0.0.0.0',
  port: 8000,
  mongodb: 'mongodb://localhost:27017/test',
  session: 'Your Session Secret goes here',
  viewsDir: 'views',
  viewEngine: 'html',
  publicDir: 'public',
  services: {},
  addService
}

class Core {
  constructor (settings) {
    this.settings = Object.assign({}, settingsDefault, settings)
    this.app = init(this.settings)
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

  addRoute(type = 'get', routePath, cb) {
    this.routes.push({ type, routePath, cb })
  }

  run () {
    const { app, settings, modules, routes } = this

    if (app) {
      routes.forEach(route => {
        const { type, routePath, cb } = route
        
        app[type](routePath, cb)
      })

      modules.forEach(m => {
        const { appRoute, appModule } = m

        app.use(appRoute, appModule(settings))
      })

      app.listen(app.get('port'), () => {
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

module.exports = Core
