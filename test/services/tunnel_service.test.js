const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const { expect } = Code

const db = require('../db/db.test')

let tunnelService = null

lab.beforeEach({ timeout: 10000 }, async () => {
  const knex = await db.resetDatabase()
  tunnelService = require('../../src/services/tunnel_service')(knex)
})

lab.test('Creates a new slug', async () => {
  const socketId = 'abc'
  const tunnel = await tunnelService.createTunnel(socketId)
  expect(tunnel.slug).to.be.a.string()
  expect(tunnel.socketId).to.equal(socketId)
})
