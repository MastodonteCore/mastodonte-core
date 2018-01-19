const fs = require('fs')
const http = require('http')
const https = require('https')

function createServer(app, ssl = {}) {
  let server;

  if (
    typeof ssl === 'object'
    && ssl.hasOwnProperty('key')
    && ssl.hasOwnProperty('cert')
  ) {
    const { key, cert } = ssl
    const credentials = {
      key: fs.readFileSync(key, 'utf8'),
      cert: fs.readFileSync(cert, 'utf8')
    }

    return server = https.createServer(credentials, app)
  } else {
    return server = http.createServer(app)
  }
}

module.exports = createServer