const Promise = require('bluebird')

module.exports = function ioService (io, tunnelService) {
  const timeout = 10000 // 10 seconds

  async function onNewTunnelRequest (socket, opts, reply) {
    const tunnel = await tunnelService.createTunnel(socket.id)
    reply(tunnel)
    // socket.emit('tunnel:new', tunnel)
  }

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
      socket.on('tunnel:new', onNewTunnelRequest.bind(null, socket))
    })
  }

  return {
    onNewTunnelRequest,
    pushProxy,
    init,
  }
}
