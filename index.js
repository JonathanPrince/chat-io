var express = require('express')
  , app     = express()
  , server  = require('http').createServer(app)
  , io      = require('socket.io')(server)
  , users   = [];

// declare path for static files
app.use(express.static(__dirname + '/public'));

// serve chat ui on get request
app.get('/', function(req, res){
	res.sendFile('index.html');
});

// listen for new connection
io.on('connection', function(client){

  client.emit('online users', users);

  // listen for username when logged in
  client.on('login', function(data){
    client.username = data;
    users.push(client.username);
    console.log('+ ' + client.username + ' logged in');
    io.emit('new user', client.username);
  });

  // listen for disconnect
  client.on('disconnect', function(){
    var userIndex = users.indexOf(client.username);
    users.splice(userIndex, 1);
    io.emit('online users', users);
    console.log('- ' + client.username + ' logged out');

    // send farewell message
    io.emit('message', {
      name: client.username,
      message: '... has left the building...'
    });
  });

  // listen for new messages
  client.on('new message', function(data){
    io.emit('message', data);
  });

});

// listen for requests on 8000
server.listen(8000, function(){
  console.log('Server listening on port 8000');
});
