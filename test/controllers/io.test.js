const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')
const { expect } = Code
const Promise = require('bluebird')

const ioController = require('../../src/controllers/io')
const ApiController = require('../../src/controllers/api')
const db = require('../db/db.test')
const lab = exports.lab = Lab.script()

lab.experiment('Socket.io Controller', async () => {
  let server = null
  let tunnelService = null
  let utilService = null
  let knex = null

  lab.before({ timeout: 10000 }, async () => {
    knex = await db.resetDatabase()
    tunnelService = require('../../src/services/tunnel_service')(knex)
    utilService = require('../../src/services/utils')()
    server = Hapi.server({
      app: {
        db: knex,
        service: {
          utils: utilService,
          tunnel: tunnelService,
        },
      },
    })
    await server.register(ioController)
    await server.register(ApiController)
  })

  lab.after(async () => {
    await knex.destroy()
  })

  lab.test('Gives a 404 response when passed an invalid domain', async () => {
    const res = await server.inject('http://invalid-slug.local.test/')
    expect(res.statusCode).to.equal(404)
  })

  lab.test('Successful proxying', { timeout: 10000 }, async () => {
    const io = require('socket.io-client')
    const socket = io(server.info.uri)
    socket.emit('tunnel:new')

    const tunnel = await new Promise((resolve, reject) => {
      socket.on('tunnel:new', (_tunnel) => resolve(_tunnel))
    }).timeout(5000)

    const targetUrl = `http://${tunnel.slug}.local.test/banana`
    const proxy = await new Promise((resolve) => {
      socket.on('tunnel:push', (request) => {
        resolve(request)
      })
    }).timeout(5000)
    const res = await server.inject(targetUrl)
    const payload = res.payload

    expect(payload.hostname).to.equal(`${tunnel.slug}.local.test`)
  })
})
