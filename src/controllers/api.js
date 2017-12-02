const Boom = require('boom')

async function register (server, options) {
  const { utils, tunnel: tunnelService } = server.app.service

  server.route({
    path: '/',
    method: 'GET',
    handler: async (request, h) => {
      const subdomain = utils.getSubDomain(request.url.hostname)
      const tunnel = await tunnelService.getTunnelBySlug(subdomain)
      if (tunnel) {
        return `Currently listening on tunnel ${subdomain}`
      } else {
        return Boom.notFound(`Tunnel ${subdomain} is invalid or stale`)
      }
    },
  })
}

module.exports = {
  register,
  name: 'api-controller',
  version: '0.1.0',
}
