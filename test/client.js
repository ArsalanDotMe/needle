const io = require('socket.io-client')
const socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log('CONNECTED!!')
})

socket.on('tunnel:new', (data) => {
  console.log('NEW TUNNEL!!!')
  console.log(data)
})

socket.on('tunnel:push', (requestInfo, reply) => {
  console.log('requestInfo', requestInfo)
  reply('Thanks!')
})
