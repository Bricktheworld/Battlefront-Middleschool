var XWings = [];
var Ties = [];

function XWing(id, x, y, z, rotationx, rotationy, rotationz, usernm) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.z = z;
  this.rotationx = rotationx;
  this.rotationy = rotationy;
  this.rotationz = rotationz;
  this.controlX = 0;
  this.controlY = 0;
  this.username = usernm;
}

function Tie(id, x, y, z, rotationx, rotationy, rotationz, usernm) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.z = z;
  this.rotationx = rotationx;
  this.rotationy = rotationy;
  this.rotationz = rotationz;
  this.controlX = 0;
  this.controlY = 0;
  this.username = usernm;
}
var express = require('express');
var app = express();
app.use(express.static('public'));
var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}
var io = require('socket.io')(server);

setInterval(heartbeat, 1000/60);

function heartbeat() {
  io.sockets.emit('heartbeat_rebel', XWings);
  io.sockets.emit('heartbeat_empire', Ties);
}

io.sockets.on('connection', function(socket) {
  var side;
  socket.on('startdata', function(data) {
    side = data.team;
    socket.username = data.username;
    socket.isAlive = true;
    console.log("We have a new client: " + socket.username);
    if (data.team == "rebel") {
      var newxwingplayer = new XWing(socket.id, 0, 0, 0, 0, 0, 0, data.username);
      //everyone else
      socket.broadcast.emit('new rebel', newxwingplayer);
      XWings.push(newxwingplayer);
      var id = socket.id;
    } else if (data.team == "empire") {
      var newtieplayer = new Tie(socket.id, 0, 0, 0, 0, 0, 0, data.username);
      //everyone else
      socket.broadcast.emit('new imperial', newtieplayer);
      Ties.push(newtieplayer);
    }
    socket.emit('entergame', "Welcome!");
    socket.emit('ID', socket.id);
    socket.emit('XWings', XWings);
    socket.emit('Ties', Ties);
    socket.on('update_rebel', function(data) {
      var xwing;
      for (var i = XWings.length - 1; i >= 0; i--) {
        if (XWings[i].id == socket.id) {
          xwing = XWings[i];
          xwing.x = data.x;
          xwing.y = data.y;
          xwing.z = data.z;
          xwing.rotationx = data.rotationx;
          xwing.rotationy = data.rotationy;
          xwing.rotationz = data.rotationz;
        }
      }

    });
    socket.on('update_empire', function(data) {
      var tie;
      for (var i = Ties.length - 1; i >= 0; i--) {
        if (Ties[i].id == socket.id) {
          tie = Ties[i];
          tie.x = data.x;
          tie.y = data.y;
          tie.z = data.z;
          tie.rotationx = data.rotationx;
          tie.rotationy = data.rotationy;
          tie.rotationz = data.rotationz;
        }
      }

    });
    socket.on('rebel_shoot', function(data) {
      io.emit('new_rebel_shot', data);
    });
    socket.on('empire_shoot', function(data) {
      io.emit('new_empire_shot', data);
    });
    socket.on('dead_rebel', function(socketid) {
      console.log("Client has died" + socketid);
      for (var i = XWings.length - 1; i >= 0; i--) {
        if (XWings[i].id == socket.id) {
          socket.broadcast.to(socketid).emit('Killed_him', XWings[i].username);
          XWings.splice(i, 1);
          io.emit('rebel_died', i);
        }
      }
    });
    socket.on('dead_imperial', function(socketid) {
      console.log("Client has died" + socketid);
      for (var i = Ties.length - 1; i >= 0; i--) {
        if (Ties[i].id == socket.id) {
          socket.broadcast.to(socketid).emit('Killed_him', Ties[i].username);
          Ties.splice(i, 1);
          io.emit('imperial_died', i);
          console.log(socketid);
        }
      }
    });
  });
  socket.on('disconnect', function() {
    console.log("Client has disconnected");
    if (side == "rebel") {
      for (var i = XWings.length - 1; i >= 0; i--) {
        if (XWings[i].id == socket.id) {
          XWings.splice(i, 1);
          io.emit('rebel_left', i);
          console.log(i);
        }
      }
    } else if (side == "empire") {
      for (var i = Ties.length - 1; i >= 0; i--) {
        if (Ties[i].id == socket.id) {
          Ties.splice(i, 1);
          io.emit('imperial_left', i);
          console.log(i);
        }
      }
    }
  });
});
