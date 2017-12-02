const Boom = require('boom')

async function register (server, options) {
  const { tunnel: tunnelService } = server.settings.app.service

  server.route({
    path: '/slug/{slug}/',
    method: 'GET',
    handler: async (request, h) => {
      console.log(request.info)
      const subdomain = request.params.slug
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
