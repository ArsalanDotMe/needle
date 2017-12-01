const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const { expect } = Code

const db = require('../db/db.test')

const tunnelService = require('../../src/services/tunnel_service')(db)

lab.test('Creates a new slug', async () => {
  const tunnel = await tunnelService.createTunnel()
  expect(tunnel.slug).to.be.a.string()
})
