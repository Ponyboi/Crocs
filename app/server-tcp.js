process.on('uncaughtException', function (err) {
    console.log(err);
}); 

// Load the TCP Library
net = require('net');

// Keep track of the chat clients
//var port = process.env.PORT || 8080;
var port = 8081;
var clients = [];
var savedTime = new Date();
var rgb = 0;

// Start a TCP Server
net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 

  // Put this new client in the list
  clients.push({socket: socket, clientType: ''});

  // Send a nice welcome message and announce
  socket.write('{"type": "welcome", "message": "Welcome ' + socket.name + '\n"}');
  console.log("Welcome " + socket.name + "\n")
  broadcast('{ "type": "welcome", "message": "' + socket.name + ' joined the chat\n" }', socket);

  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    var message = JSON.parse(data);
    if (message != null) {
      //console.log(message);
      if (message.type == "signature") {
        clients.forEach(function (client, index) {
          if (client.socket.remoteAddress == socket.remoteAddress) {
            client.clientType = message.signature;
          }
        });
      }
      if (message.type == "controller") {
          console.log(message);
          if (message.state == "initconn") {
              console.log('initconn')
          } else if (message.state == "calibrating") {
              console.log('Controller is calibrating');
          } else if (message.state == "LED") {
              console.log(message.bulb, message.r, message.g, message.b);
              var newRgb = data.r + data.g + data.b;
              var currentTime = new Date();
              if ((currentTime - savedTime) > 40 && rgb != newRgb) {
                broadcast(data, socket);
              }
              rgb = newRgb;
              savedTime = currentTime;
          } else if (message.state == "motor") {
              broadcast(data, socket);
          }
      }

      // if (message.type == "control" && message.state == "CONTROLLER") {
      //     broadcastLed(message, socket);
      //     console.log(message);
      // }
      // if (message.type == "control" && message.state == "MoveUpKeyup") {
      //     console.log(message);
      // }
      // if (message.type == "control" && message.state == "MoveDownClick") {
      //     console.log(message);
      // }
      // if (message.type == "control" && message.state == "MoveDownKeyup") {
      //     console.log(message);
      // }
      // if (message.type == "control" && message.state == "SliderBrightnessUpdate") {
      //     broadcastLed(data, socket);
      //     console.log(message.value);
      // }
    }      

  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.forEach(function (client, index) {
      if (client.socket.remoteAddress == socket.remoteAddress) {
        clients.splice(index, 1);
      }
    });
    //clients.splice(clients.indexOf(socket), 1);
    broadcast('{ "type": "END", "message": "' + socket.name + ' left the chat.\n" }');
  });
  
  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.socket.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
  }
    function broadcastLed(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      if (client.signature == "LED") {
        client.socket.write(message);
      }
    });
    function interval(duration, fn){
      this.baseline = undefined
      
      this.run = function(){
        if(this.baseline === undefined){
          this.baseline = new Date().getTime()
        }
        fn()
        var end = new Date().getTime()
        this.baseline += duration
     
        var nextTick = duration - (end - this.baseline)
        if(nextTick<0){
          nextTick = 0
        }
        (function(i){
            i.timer = setTimeout(function(){
            i.run(end)
          }, nextTick)
        }(this))
      }

    this.stop = function(){
       clearTimeout(this.timer)
     }
    }
    // Log it to the server output too
    process.stdout.write(message)
    
  }

}).listen(port);

console.log('\033[96m'+'Listening on ' + port +'\033[39m');
