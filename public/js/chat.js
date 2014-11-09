(function() {

  var socket = io.connect();
  var userList = document.getElementById('users');
  var sendButton = document.getElementById('send');
  var messages = document.getElementById('messages');
  var textIn = document.getElementById('input');
  var user;

  console.log(sessionStorage.getItem("username"));

  if (sessionStorage.getItem("username") == 'null' ||
      sessionStorage.getItem("username") == null){

    user = prompt('username?');

    sessionStorage.setItem('username', user);

  } else {

    user = sessionStorage.getItem("username");

  }

  socket.emit('login', user);

  function addNewUser(name){
    var item = document.createElement('li');
    var txt = document.createTextNode(name);
    item.appendChild(txt);
    userList.appendChild(item);
  }

  function sendMessage(e){
    e.preventDefault();
    var msg = textIn.value;
    socket.emit('new message', {name: user, message: msg});
    textIn.value = '';
  }

  function addMessage(data){
    var entry = document.createElement('div');
    var txt = document.createTextNode(data.name + ': ' + data.message);
    entry.appendChild(txt);
    messages.appendChild(entry);
  }

  function sendOnEnter(e){
    if(e.keyCode === 13){
      sendMessage(e);
    }
  }

  sendButton.addEventListener('click', sendMessage, false);
  textIn.addEventListener('keypress', sendOnEnter, false);

  socket.on('online users', function(data){

    while (userList.firstChild) {
      userList.removeChild(userList.firstChild);
    }

    data.forEach(function(el){
      addNewUser(el);
    });

  });

  socket.on('new user', function(data){
    addNewUser(data);
  });

  socket.on('message', function(data){
    addMessage(data);
  });

})();
