const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')
const { expect } = Code

const ApiController = require('../../src/controllers/api')
const db = require('../db/db.test')
const lab = exports.lab = Lab.script()

lab.experiment('Main API Controller', async () => {
  let server = null
  let tunnelService = null
  let knex = null

  lab.before(async () => {
    knex = await db.resetDatabase()
    tunnelService = require('../../src/services/tunnel_service')(knex)
    server = Hapi.server({
      app: {
        service: {
          tunnel: tunnelService,
        },
      },
    })
    await server.register({
      plugin: require('hapi-subdomain'),
      options: {
        exclude: ['www', 'api', 'mail'],
        destination: '/slug',
      },
    })
    await server.register(ApiController)
  })

  lab.after(async () => {
    await knex.destroy()
  })

  lab.test('Gives a 404 response when passed an invalid domain', async () => {
    const res = await server.inject('http://invalid-slug.local.test/')
    expect(res.statusCode).to.equal(404)
  })

  lab.test('Gives a 200 response when slug exists', async () => {
    const tunnel = await tunnelService.createTunnel('fff')
    const res = await server.inject(`http://${tunnel.slug}.local.test/`)
    expect(res.statusCode).to.equal(200)
  })
})
