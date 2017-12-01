const knex = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL,
  debug: true,
})

module.exports = knex
