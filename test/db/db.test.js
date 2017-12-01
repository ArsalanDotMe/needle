require('dotenv-safe').load()

const knex = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL_TEST,
  debug: true,
})

module.exports = knex
