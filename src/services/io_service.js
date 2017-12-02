const Boom = require('boom')
const Promise = require('bluebird')

module.exports = function ioService (io, tunnelService) {
  const timeout = 10000 // 10 seconds

  async function onNewTunnelRequest (socket) {
    const tunnel = await tunnelService.createTunnel(socket.id)
    socket.emit('tunnel:new', tunnel)
  }

  const responseCallbacks = {}

  async function pushProxy (requestInfo, slug) {
    const tunnel = await tunnelService.getTunnelBySlug(slug)

    return new Promise((resolve) => {
      io.sockets.sockets[tunnel.socket_id].emit('tunnel:push', requestInfo, (response) => {
        resolve(response)
      })
    }).timeout(timeout)
  }

  async function init () {
    io.on('connection', (socket) => {
      console.log('NEW CONNECTION')
      onNewTunnelRequest(socket)
      // socket.on('tunnel:new', onNewTunnelRequest.bind(null, socket))
    })

    io.on('tunnel:response', (response) => {
      if (responseCallbacks[response.id]) {
        responseCallbacks[response.id](response)
        delete responseCallbacks[response.id]
      }
    })
  }

  return {
    onNewTunnelRequest,
    pushProxy,
    init,
  }
}
