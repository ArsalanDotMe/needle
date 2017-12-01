
async function register (server, options) {
  const tunnelService = require('../services/tunnel_service')(server.app.db)

  server.route({
    path: '/new',
    method: 'POST',
    handler: async (request, h) => {
      return tunnelService.createTunnel()
    },
  })
}

module.exports = {
  register,
  name: 'api-controller',
  version: '0.1.0',
}
