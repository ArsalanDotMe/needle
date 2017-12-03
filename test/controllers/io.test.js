const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')
const debug = require('debug')('io.test')
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

  lab.test('Successful proxying', { timeout: 10000 }, async () => {
    const io = require('socket.io-client')
    const requestTimeout = 5000

    debug('starting server...')
    await server.start()
    debug(`Server started and listening at port ${server.info.port}`)

    const socket = io(`http://localhost:${server.info.port}`)

    debug('requesting new tunnel...')
    const tunnel = await new Promise((resolve) => {
      socket.emit('tunnel:new', {}, (tunnelInfo) => {
        resolve(tunnelInfo)
      })
    }).timeout(requestTimeout)
    debug('new tunnel received!')

    const targetUrl = `http://${tunnel.slug}.local.test/banana`
    const proxyPromise = new Promise((resolve) => {
      socket.on('tunnel:push', (request, reply) => {
        resolve({ request, reply })
      })
    }).timeout(5000)
    const resPromise = server.inject({
      method: 'GET',
      url: targetUrl,
    })
    const { request: proxiedData, reply } = await proxyPromise
    expect(proxiedData.hostname).to.equal(`${tunnel.slug}.local.test`)

    reply({ method: 'GET' })

    const response = await resPromise
    const payload = JSON.parse(response.payload)
    expect(payload.method).to.equal('GET')
  })
})
