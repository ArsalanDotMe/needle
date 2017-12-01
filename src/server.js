require('dotenv-safe').load()

const Hapi = require('hapi')
const { PORT } = process.env
const db = require('./db/db')

const server = Hapi.server({ port: PORT, app: { db } })

async function init () {
  try {
    await server.register(require('./controllers/api'))
    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
  } catch (error) {
    console.error('Error starting server')
    console.error(error)
  }
}

init()
