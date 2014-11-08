var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile('index.html');
});

io.on('connection', function(){
  console.log('User connected');
});

server.listen(8000, function(){
  console.log('Server listening on port 8000');
});
