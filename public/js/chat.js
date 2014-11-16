(function() {

  var socket     = io.connect(),
      userList   = document.getElementById('users'),
      sendButton = document.getElementById('send'),
      messages   = document.getElementById('messages'),
      textIn     = document.getElementById('input'),
      audio      = document.getElementById('audio'),
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
      if (typingSent === true) {
        clearTimeout(timerId);
        typingEnded();
      }
    }
  };

  var addMessage = function(data) {
    var entry = document.createElement('div');
    var txt = document.createTextNode(data.name + ': ' + data.message);
    entry.appendChild(txt);
    messages.appendChild(entry);
    messages.scrollTop = messages.scrollHeight;
    if (data.name !== user) {
      audio.play();
    }
  };

  var showTyping = function(name, state) {
    var color = state ? 'red' : '#000';
    var users = userList.childNodes;
    for (var i = 0; i < users.length; i++) {
      if (users[i].innerHTML === name) {
        users[i].style.color = color;
      }
    }
  };

  var typingSent = false;
  var timerId;

  var typingEnded = function(){

    socket.emit('stop typing', {name: user});
    typingSent = false;
  };

  var keypressHandler = function(e) {

    // send message on enter or send typing feedback
    if(e.keyCode === 13){

      sendMessage(e);

    } else {

      // check if user was already typing
      if (typingSent === false) {

        // send message that using is typing
        socket.emit('typing', {name: user});
        typingSent = true;
        timerId = setTimeout(typingEnded, 5000);
      } else {

        // clear timer and restart
        clearTimeout(timerId);
        timerId = setTimeout(typingEnded, 5000);
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
    showTyping(data.name, true);
  });
  socket.on('stop typing', function(data){
    showTyping(data.name, false);
  });

})();
