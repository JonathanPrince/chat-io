var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile('index.html');
});

var loggedIn = [];

io.on('connection', function(client){

  client.emit('online users', loggedIn);

  client.on('login', function(data){
    client.user = data;
    console.log('+' + client.user + ' logged in');
    loggedIn.push(client.user);
    io.emit('new user', client.user);
  });

  client.on('disconnect', function(){
    var thisUserIndex = loggedIn.indexOf(client.user);
    loggedIn.splice(thisUserIndex, 1);
    io.emit('online users', loggedIn);
  });

  client.on('new message', function(data){
    io.emit('message', data);
  });

});

server.listen(8000, function(){
  console.log('Server listening on port 8000');
});
