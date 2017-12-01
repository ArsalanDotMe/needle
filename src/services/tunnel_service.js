const uniqueSlug = require('unique-slug')

module.exports = function tunnelService (db) {
  const tunnelTable = 'tunnel'

  return {
    createTunnel: async function createTunnel () {
      const slug = uniqueSlug()
      await db(tunnelTable).insert({
        slug,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      })
      return {
        slug,
      }
    },
  }
}
