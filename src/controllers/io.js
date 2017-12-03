const SocketIO = require('socket.io')
const debug = require('debug')('io.ctrl')

async function register (server, options) {
  const { tunnel: tunnelService } = server.settings.app.service
  const io = SocketIO.listen(server.listener)
  const ioService = require('../services/io_service')(io, tunnelService)

  await ioService.init()
  debug('IO Service initiated')

  server.method('proxyPush', async (request, slug) => {
    debug('New proxy push request arrived')
    const raw = request.raw.req
    const requestInfo = {
      id: request.info.id,
      url: raw.url,
      headers: raw.headers,
      method: raw.method,
      host: request.info.host,
      hostname: request.info.hostname,
      protocol: raw.protocol,
    }
    debug('Pushing following to ioService for proxy push', requestInfo)
    return ioService.pushProxy(requestInfo, slug)
  })
}

module.exports = {
  register,
  name: 'socket-controller',
  version: '0.1.0',
}
