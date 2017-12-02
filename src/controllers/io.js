const SocketIO = require('socket.io')

async function register (server, options) {
  const { tunnel: tunnelService } = server.settings.app.service
  const io = SocketIO.listen(server.listener)
  const ioService = require('../services/io_service')(io, tunnelService)

  await ioService.init()

  server.method('proxyPush', async (request, slug) => {
    const raw = request.raw.req
    const requestInfo = {
      id: request.info.id,
      url: raw.url,
      headers: raw.headers,
      method: raw.method,
      host: request.info.host,
      hostname: request.info.hostname,
      protocol: raw.protocol,
      parsedUrl: request.url,
    }
    return ioService.pushProxy(requestInfo, slug)
  })
}

module.exports = {
  register,
  name: 'socket-controller',
  version: '0.1.0',
}
