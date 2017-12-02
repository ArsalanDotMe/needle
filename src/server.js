require('dotenv-safe').load()

const Hapi = require('hapi')
const { PORT } = process.env
const db = require('./db/db')

const server = Hapi.server({
  port: PORT,
  app: {
    db,
    service: {
      tunnel: require('./services/tunnel_service')(db),
      utils: require('./services/utils')(),
    },
  },
})

async function init () {
  try {
    await server.register({
      plugin: require('hapi-subdomain'),
      options: {
        exclude: ['www', 'api', 'mail'],
        destination: '/slug',
      },
    })
    await server.register(require('./controllers/api'))
    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
  } catch (error) {
    console.error('Error starting server')
    console.error(error)
  }
}

init()
