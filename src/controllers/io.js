
async function register (server, options) {
  const tunnelService = require('../services/tunnel_service')(server.app.db)
  const io = require('socket.io')(server.listener)

  io.on('connection', (socket) => {
    socket.on('tunnel:new', async () => {
      const tunnel = await tunnelService.createTunnel(socket.id)
      socket.emit('tunnel:new', tunnel)
    })
  })
}

module.exports = {
  register,
  name: 'socket-controller',
  version: '0.1.0',
}
