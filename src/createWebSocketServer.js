const WebSocket = require('ws')

function createWebSocketServer(server) {
  return new WebSocket.Server({ server })
}

module.exports = createWebSocketServer