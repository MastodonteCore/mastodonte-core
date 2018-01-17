const init = require('./init');

const settingsDefault = {
  host: '0.0.0.0',
  port: 8000,
  mongodb: 'mongodb://localhost:27017/test',
  session: 'Your Session Secret goes here',
  viewsDir: 'views',
  publicDir: 'public',
  services: {}
}

const addModule = function(appName, appModule) {
  const { modules } = this;

  if (modules) {
    modules.push({
      appRoute: `/${appName}`,
      appModule
    })
  }
}

const addService = function(serviceName, fn) {
  const { settings } = this;

  if (settings && settings.services) {
    const { services } = settings;

    Object.defineProperty(services, serviceName, {
      value: fn,
      writable: true,
      enumerable: true,
      configurable: true
    })
  }
}

const run = function() {
  const { settings } = this;

  if (settings && settings !== {}) {
    init(this); 
  }
}

module.exports = {
  app: null,
  settings: settingsDefault,
  modules: [],
  add: addModule,
  addService,
  run
}