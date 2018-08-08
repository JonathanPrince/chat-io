'use strict'

const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const log = require('./lib/log')
const msgs = []
const users = []

// declare path for static files
app.use(express.static(path.join(__dirname, '/public')))

// serve chat ui on get request
app.get('/', (req, res) => res.sendFile('index.html'))

// listen for new connection
io.on('connection', client => {
  io.emit('online users', users)

  // listen for username when logged in
  client.on('login', username => {
    client.username = username
    users.push(username)
    log(`+ ${username} logged in`)
    io.emit('new user', username)
    msgs.forEach(msg => client.emit('message', msg))
    io.emit('message', {
      name: username,
      message: '... joined the party...'
    })
  })

  // listen for disconnect
  client.on('disconnect', () => {
    if (typeof client.username !== 'undefined') {
      const userIndex = users.indexOf(client.username)
      users.splice(userIndex, 1)
      log(`- ${client.username} logged out`)
      io.emit('online users', users)

      // send farewell message
      io.emit('message', {
        name: client.username,
        message: '... has left the building...'
      })
    }
  })

  // listen for new messages
  client.on('new message', data => {
    io.emit('message', data)
    log(`${data.name} : ${data.message}`)
    msgs.push(data)
    while (msgs.length > 10) {
      msgs.shift()
    }
  })

  // listen for typing
  client.on('typing', data => client.broadcast.emit('typing', data))
  client.on('stop typing', data => client.broadcast.emit('stop typing', data))
})

// listen for requests on 8000
server.listen(8000, () => console.log('Server listening on port 8000'))
