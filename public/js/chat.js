(function() {

  var socket     = io.connect(),
      userList   = document.getElementById('users'),
      sendButton = document.getElementById('send'),
      messages   = document.getElementById('messages'),
      textIn     = document.getElementById('input'),
      user;

  var addNewUser = function(name) {
    var item = document.createElement('li');
    var txt = document.createTextNode(name);
    item.appendChild(txt);
    userList.appendChild(item);
  };

  var sendMessage = function(e) {
    e.preventDefault();
    var msg = textIn.value;
    if (msg !== '') {
      socket.emit('new message', {name: user, message: msg});
      textIn.value = '';
    }
  };

  var addMessage = function(data) {
    var entry = document.createElement('div');
    var txt = document.createTextNode(data.name + ': ' + data.message);
    entry.appendChild(txt);
    messages.appendChild(entry);
    messages.scrollTop = messages.scrollHeight;
  };

  var showTyping = function(name) {
    console.log(name + ' is typing');
    var users = userList.childNodes;
    for (var i = 0; i < users.length; i++) {
      if (users[i].innerHTML === name) {
        users[i].style.color = 'red';
      }
    }
  };

  var stopTyping = function(name) {
    console.log(name + ' stopped typing');
    var users = userList.childNodes;
    for (var i = 0; i < users.length; i++) {
      if (users[i].innerHTML === name) {
        users[i].style.color = '#000';
      }
    }
  };

  var typing = false;

  var keypressHandler = function(e) {
    if(e.keyCode === 13){
      sendMessage(e);
    } else {
      if (typing === false) {
        typing = true;
        socket.emit('typing', {name: user});
        setTimeout(function(){
          typing = false;
          socket.emit('stop typing', {name: user});
        }, 5000);
      }
    }
  };

  if (sessionStorage.getItem("username") == 'null' ||
      sessionStorage.getItem("username") == null) {

    user = prompt('username?');

    sessionStorage.setItem('username', user);

  } else {

    user = sessionStorage.getItem("username");

  }

  socket.emit('login', user);

  // event listeners for ui
  sendButton.addEventListener('click', sendMessage, false);
  textIn.addEventListener('keyup', keypressHandler, false);

  // listen for server sending list of users
  socket.on('online users', function(data){

    while (userList.firstChild) {
      userList.removeChild(userList.firstChild);
    }

    data.forEach(function(el){
      addNewUser(el);
    });

  });

  // listen for new user joining
  socket.on('new user', function(data){
    addNewUser(data);
  });

  // listen for messages
  socket.on('message', function(data){
    addMessage(data);
  });

  // listen for typing
  socket.on('typing', function(data){
    showTyping(data.name);
  });
  socket.on('stop typing', function(data){
    stopTyping(data.name);
  });

})();
