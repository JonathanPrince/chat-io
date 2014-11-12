var express = require('express')
  , app     = express()
  , server  = require('http').createServer(app)
  , io      = require('socket.io')(server)
  , now     = require('dateformat')
  , msgs    = []
  , users   = [];

// declare path for static files
app.use(express.static(__dirname + '/public'));

// serve chat ui on get request
app.get('/', function(req, res){
	res.sendFile('index.html');
});

// listen for new connection
io.on('connection', function(client){

  io.emit('online users', users);

  // listen for username when logged in
  client.on('login', function(data){
    client.username = data;
    users.push(client.username);
    console.log(now() + ' + ' + client.username + ' logged in');
    io.emit('new user', client.username);
    msgs.forEach(function(msg){
      client.emit('message', msg);
    });
    io.emit('message', {
      name: client.username,
      message: '... joined the party...'
    });
  });

  // listen for disconnect
  client.on('disconnect', function(){
    if (typeof client.username !== 'undefined') {
      var userIndex = users.indexOf(client.username);
      users.splice(userIndex, 1);
      console.log(now() + ' - ' + client.username + ' logged out');
      io.emit('online users', users);

      // send farewell message
      io.emit('message', {
        name: client.username,
        message: '... has left the building...'
      });
    }
  });

  // listen for new messages
  client.on('new message', function(data){
    io.emit('message', data);
    msgs.push(data);
    while (msgs.length > 10) {
      msgs.shift();
    }
  });

});

// listen for requests on 8000
server.listen(8000, function(){
  console.log('Server listening on port 8000');
});
