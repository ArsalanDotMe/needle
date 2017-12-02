module.exports = function ioService(io, tunnelService) {
  async function onNewTunnelRequest (socket) {
    const tunnel = await tunnelService.createTunnel(socket.id)
    socket.emit('tunnel:new', tunnel)
  }

  io.on('connection', (socket) => {
    socket.on('tunnel:new', onNewTunnelRequest.bind(null, socket))
  })
}
