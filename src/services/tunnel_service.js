const uniqueSlug = require('unique-slug')

module.exports = function tunnelService (db) {
  const tunnelTable = 'tunnel'

  async function createTunnel (socketId) {
    const slug = uniqueSlug()
    await db(tunnelTable).insert({
      slug,
      socket_id: socketId,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    return {
      socketId: socketId,
      slug,
    }
  }

  async function getTunnelBySlug (slug) {
    const tunnel = await db(tunnelTable).where({ slug }).first()
    return tunnel
  }
  return {
    createTunnel,
    getTunnelBySlug,
  }
}
