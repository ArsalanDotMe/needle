require('dotenv-safe').load()

const { DB_URL, DB_URL_TEST } = process.env

module.exports = {
  client: 'postgresql',
  connection: DB_URL,
  migrations: {
    directory: 'app/migrations',
  },
  test: {
    client: 'postgresql',
    connection: DB_URL_TEST,
    migrations: {
      directory: 'app/migrations',
    },
  }
}
