require('dotenv-safe').load()

function getDbName (dbUrl) {
  return /\/(\w+)$/.exec(dbUrl)[1]
}

const migrationsConfig = {
  directory: 'app/migrations',
}

async function resetDatabase () {
  const defaultConnUrl = process.env.DB_URL_TEST
  const dbName = getDbName(defaultConnUrl)
  let knex = require('knex')({
    client: 'pg',
    connection: defaultConnUrl.replace(dbName, 'postgres'),
    // debug: true,
  })
  await knex.raw(`DROP DATABASE IF EXISTS ${dbName}`)
  await knex.raw(`CREATE DATABASE ${dbName}`)
  await knex.destroy()
  knex = require('knex')({
    client: 'pg',
    connection: defaultConnUrl,
    // debug: true,
  })
  await knex.migrate.latest(migrationsConfig)
  return knex
}

module.exports = {
  resetDatabase,
}
