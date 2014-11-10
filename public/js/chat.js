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
    socket.emit('new message', {name: user, message: msg});
    textIn.value = '';
  };

  var addMessage = function(data) {
    var entry = document.createElement('div');
    var txt = document.createTextNode(data.name + ': ' + data.message);
    entry.appendChild(txt);
    messages.appendChild(entry);
    messages.scrollTop = messages.scrollHeight;
  };

  var sendOnEnter = function(e) {
    if(e.keyCode === 13){
      sendMessage(e);
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
  textIn.addEventListener('keypress', sendOnEnter, false);

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

})();
