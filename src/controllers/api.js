const Boom = require('boom')

async function register (server, options) {
  const { utils, tunnel: tunnelService } = server.settings.app.service

  server.route({
    path: '/slug/{slug}/{p*}',
    method: '*',
    handler: async (request, h) => {
      console.log('SLUG HANDLER ROUTE')
      const subdomain = request.params.slug
      const tunnel = await tunnelService.getTunnelBySlug(subdomain)

      if (!tunnel) {
        return Boom.notFound(`Tunnel ${subdomain} is invalid or stale`)
      } else {
        try {
          const response = await server.methods.proxyPush(request, subdomain)
          return response
        } catch (error) {
          console.error(error)
          return Boom.badImplementation(error)
        }
      }
    },
  })
  // Catch-All Route
  server.route({
    path: '/{p*}',
    method: '*',
    handler: async (request, h) => {
      console.log('CATCH-ALL ROUTE')
      const subdomain = utils.getSubDomain(request.info.hostname)
      const tunnel = await tunnelService.getTunnelBySlug(subdomain)

      if (!tunnel) {
        return Boom.notFound(`Tunnel ${subdomain} is invalid or stale`)
      } else {
        const response = await server.methods.proxyPush(request, subdomain)
        return response
      }
    },
  })
}

module.exports = {
  register,
  name: 'api-controller',
  version: '0.1.0',
  dependencies: 'socket-controller',
}
