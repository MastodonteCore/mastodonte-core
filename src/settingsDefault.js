const addService = require('./addService')

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

module.exports = settingsDefault