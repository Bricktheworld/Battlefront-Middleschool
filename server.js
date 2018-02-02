var BABYLON = require('babylonjs');
global.XMLHttpRequest = require('xhr2').XMLHttpRequest;
var engine = new BABYLON.NullEngine();
var scene = new BABYLON.Scene(engine);
var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);


var XWings = [];
var Ties = [];
var Empirebots = [];
var Rebelbots = [];
var Empirebotboxes = [];
var Rebelbotboxes = [];
var XWinglazers = [];
var Tielazers = [];
var Usernames = ["[BOT]Sheldon", "[BOT]Pillar", "Tarka", "[BOT]Mei", "[BOT]Jem Dies", "[BOT]You Suck cus (a)I", "[BOT]LOL", "[BOT]I was just bullied", "[BOT]Stop Bullying Me", "[BOT]BotBotBotBotBot", "[BOT]01101000 01101001", "[BOT]I suck", "[BOT]I need better AI", "[BOT]Just want to be good", "[BOT]Iwanttobewherepeopleare"];
var needXWing = false;
var needTie = false;

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

function empirebot(x, y, z, rotx, roty, rotz, usernm, id, obj, orig) {
  this.username = usernm;
  this.id = id;
  this.health = 200;
  this.searching = true;
  this.targeted = false;
  this.data = {
    x: 0,
    y: 0,
    z: 0,
    rotationx: 0,
    rotationy: 0,
    rotationz: 0,
    id: this.id,
    username: this.username
  };
  this.object = obj
  this.origin = orig
  this.alive = true;
}
empirebot.prototype.searchtarget = function() {
  if (XWings.length >= 1) {
    this.target_index = Math.floor(Math.random() * Math.floor(XWings.length));
    this.target = XWings[this.target_index];
    this.searching = false;
    this.finding = true
  } else {
    this.searching = true;
    this.finding = false;
  }
}
empirebot.prototype.shoot = function() {
  if (this.targeted && this.health > 0) {
    var lazer = BABYLON.Mesh.CreateBox("Pew", 20, scene);
    lazer.position.x = this.data.x;
    lazer.position.y = this.data.y;
    lazer.position.z = this.data.z;
    lazer.rotation.x = this.data.rotationx;
    lazer.rotation.y = this.data.rotationy;
    lazer.rotation.z = this.data.rotationz;
    lazer.id = this.data.id;
    lazer.timeout = 60;
    Tielazers.push(lazer);
    io.emit('new_empire_shot', this.data);
  }
}
empirebot.prototype.update = function(object) {
  if (this.searching) {
    this.searchtarget();
  }
  if (this.finding) {
    this.targeted = faceTarget(object, this.target);
  }
  this.data = {
    x: object.position.x,
    y: object.position.y,
    z: object.position.z,
    rotationx: object.rotation.x,
    rotationy: object.rotation.y,
    rotationz: object.rotation.z,
    id: false,
    username: this.username
  };
  this.origin.x = this.data.x;
  this.origin.y = this.data.y;
  this.origin.z = this.data.z;
  this.origin.rotationx = this.data.rotationx;
  this.origin.rotationy = this.data.rotationy;
  this.origin.rotationz = this.data.rotationz;
}

function rebelbot(x, y, z, rotx, roty, rotz, usernm, id, obj, orig) {
  this.username = usernm;
  this.id = id;
  this.health = 200;
  this.searching = true;
  this.targeted = false;
  this.data = {
    x: 0,
    y: 0,
    z: 0,
    rotationx: 0,
    rotationy: 0,
    rotationz: 0,
    id: this.id,
    username: this.username
  };
  this.object = obj
  this.origin = orig
  this.alive = true;
}
rebelbot.prototype.searchtarget = function() {
  if (Ties.length >= 1) {
    this.target_index = Math.floor(Math.random() * Math.floor(Ties.length));
    this.target = Ties[this.target_index];
    this.searching = false;
    this.finding = true
  } else {
    this.searching = true;
    this.finding = false;
  }

}
rebelbot.prototype.shoot = function() {
  if (this.targeted && this.health > 0) {
    var lazer = BABYLON.Mesh.CreateBox("Pew", 20, scene);
    lazer.position.x = this.data.x;
    lazer.position.y = this.data.y;
    lazer.position.z = this.data.z;
    lazer.rotation.x = this.data.rotationx;
    lazer.rotation.y = this.data.rotationy;
    lazer.rotation.z = this.data.rotationz;
    lazer.id = this.data.id;
    lazer.timeout = 60;
    XWinglazers.push(lazer);
    io.emit('new_rebel_shot', this.data);
  }
}
rebelbot.prototype.update = function(object) {
  if (this.searching) {
    this.searchtarget();
  }
  if (this.finding) {
    this.targeted = faceTarget(object, this.target);
  }
  this.data = {
    x: object.position.x,
    y: object.position.y,
    z: object.position.z,
    rotationx: object.rotation.x,
    rotationy: object.rotation.y,
    rotationz: object.rotation.z,
    id: false,
    username: this.username
  };
  this.origin.x = this.data.x;
  this.origin.y = this.data.y;
  this.origin.z = this.data.z;
  this.origin.rotationx = this.data.rotationx;
  this.origin.rotationy = this.data.rotationy;
  this.origin.rotationz = this.data.rotationz;
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

setInterval(heartbeat, 1000 / 60);

function heartbeat() {
  io.sockets.emit('heartbeat_rebel', XWings);
  io.sockets.emit('heartbeat_empire', Ties);
}
setInterval(function() {
  if (XWings.length >= 1 && Ties.length === 0 || XWings.length > Ties.length) {
    needTie = true;
  } else if (Ties.length >= 1 && XWings.length === 0 || Ties.length > XWings.length) {
    needXWing = true;
  } else {
    needTie = false;
    needXWing = false;
  }

}, 100);
setInterval(function() {
  if (needXWing) {
    var id = guidGenerator();
    var usernameint = Math.floor(Math.random() * Usernames.length);
    var username = Usernames[usernameint];
    console.log(username)
    var newxwingbox = BABYLON.Mesh.CreateBox("botbox", 20, scene);
    var newxwingobj = new XWing(id, 0, 0, 0, 0, 0, 0, username);
    var newxwingbot = new rebelbot(0, 0, 0, 0, 0, 0, username, id, newxwingbox, newxwingobj);
    Rebelbotboxes.push(newxwingbox);
    Rebelbots.push(newxwingbot);
    io.sockets.emit('new rebel', newxwingobj);
    XWings.push(newxwingobj);
  }
  if (needTie) {
    var id = guidGenerator();
    var usernameint = Math.floor(Math.random() * Usernames.length);
    var username = Usernames[usernameint];
    var newtiebox = BABYLON.Mesh.CreateBox("botbox", 20, scene);
    var newtieobj = new Tie(id, 0, 0, 0, 0, 0, 0, username);
    var newtiebot = new empirebot(0, 0, 0, 0, 0, 0, username, id, newtiebox, newtieobj);
    Empirebotboxes.push(newtiebox);
    Empirebots.push(newtiebot);
    io.sockets.emit('new imperial', newtieobj);
    Ties.push(newtieobj);
  }
}, 15000);
setInterval(function() {
  for (var i = Empirebots.length - 1; i >= 0; i--) {
    if (Empirebots[i] != null) {
      Empirebots[i].shoot();
    }
  }
  for (var i = Rebelbots.length - 1; i >= 0; i--) {
    if (Rebelbots[i] != null) {
      Rebelbots[i].shoot();
    }
  }
}, 1000 / 3);

io.sockets.on('connection', function(socket) {
  var side;
  socket.on('startdata', function(data) {
    side = data.team;
    socket.username = data.username;
    socket.isAlive = true;
    console.log("We have a new client: " + socket.username);
    if (data.team == "rebel") {
      var newxwingplayer = new XWing(socket.id, 0, 0, 0, 0, 0, 0, data.username);
      socket.player = newxwingplayer;
      Rebelbotboxes.push(null);
      Rebelbots.push(null);
      //everyone else
      socket.broadcast.emit('new rebel', newxwingplayer);
      XWings.push(newxwingplayer);
      var id = socket.id;
    } else if (data.team == "empire") {
      var newtieplayer = new Tie(socket.id, 0, 0, 0, 0, 0, 0, data.username);
      socket.player = newtieplayer;
      Empirebotboxes.push(null);
      Empirebots.push(null);
      //everyone else
      socket.broadcast.emit('new imperial', newtieplayer);
      Ties.push(newtieplayer);

      var id = socket.id;
    }
    socket.emit('entergame', "Welcome!");
    socket.emit('ID', socket.id);
    socket.emit('XWings', XWings);
    socket.emit('Ties', Ties);
    socket.on('update_rebel', function(data) {
      var xwing;
      xwing = socket.player;
      xwing.x = data.x;
      xwing.y = data.y;
      xwing.z = data.z;
      xwing.rotationx = data.rotationx;
      xwing.rotationy = data.rotationy;
      xwing.rotationz = data.rotationz;

    });
    socket.on('update_empire', function(data) {
      var tie;
      tie = socket.player;
      tie.x = data.x;
      tie.y = data.y;
      tie.z = data.z;
      tie.rotationx = data.rotationx;
      tie.rotationy = data.rotationy;
      tie.rotationz = data.rotationz;

    });
    socket.on('rebel_shoot', function(data) {
      var lazer = BABYLON.Mesh.CreateBox("Pew", 20, scene);
      lazer.position.x = data.x;
      lazer.position.y = data.y;
      lazer.position.z = data.z;
      lazer.rotation.x = data.rotationx;
      lazer.rotation.y = data.rotationy;
      lazer.rotation.z = data.rotationz;
      lazer.id = data.id;
      lazer.timeout = 60;
      XWinglazers.push(lazer);
      io.emit('new_rebel_shot', data);
    });
    socket.on('empire_shoot', function(data) {
      var lazer = BABYLON.Mesh.CreateBox("Pew", 20, scene);
      lazer.position.x = data.x;
      lazer.position.y = data.y;
      lazer.position.z = data.z;
      lazer.rotation.x = data.rotationx;
      lazer.rotation.y = data.rotationy;
      lazer.rotation.z = data.rotationz;
      lazer.id = data.id;
      lazer.timeout = 60;
      Tielazers.push(lazer);
      io.emit('new_empire_shot', data);
    });
    socket.on('dead_rebel', function(socketid) {
      console.log("Client has died" + socketid);
      //       for (var i = Empirebots.length - 1; i >= 0; i--) {
      //         if (Empirebots[i].id == socketid) {
      //           Empirebots[i].searching = true;
      //         }
      //       }
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
      //       for (var i = Rebelbots.length - 1; i >= 0; i--) {
      //         if (Rebelbots[i].id == socketid) {
      //           Rebelbots[i].searching = true;
      //         }
      //       }
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
      for (var i = Empirebots.length - 1; i >= 0; i--) {
        if (Empirebots[i].target.id == socket.id) {
          Empirebots[i].searching = true;
        }
      }
      for (var i = XWings.length - 1; i >= 0; i--) {
        if (XWings[i].id == socket.id) {
          XWings.splice(i, 1);
          io.emit('rebel_left', i);
          console.log(i);
        }
      }
    } else if (side == "empire") {
      for (var i = Rebelbots.length - 1; i >= 0; i--) {
        if (Rebelbots[i].target.id == socket.id) {
          Rebelbots[i].searching = true;
        }
      }
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

engine.runRenderLoop(function() {
  for (var i = 0; i < Empirebotboxes.length; i++) {
    if (Empirebotboxes[i] != null) {
      Empirebots[i].update(Empirebotboxes[i]);
      Empirebotboxes[i].translate(BABYLON.Axis.Z, 1.5, BABYLON.Space.LOCAL);
      var box = Empirebotboxes[i];
      XWinglazers.forEach(function(xwinglazer, index_lazer) {
        xwinglazer.translate(BABYLON.Axis.Z, 40, BABYLON.Space.LOCAL);
        xwinglazer.timeout -= 1;
        if (xwinglazer.timeout <= 0) {
          xwinglazer.dispose();
          XWinglazers.splice(index_lazer, 1);
        } else {
          if (xwinglazer.intersectsMesh(Empirebotboxes[i], false)) {
            Empirebots[i].health -= 20;
            console.log(Empirebots[i].health);
            if (Empirebots[i].health <= 0) {
              Empirebots[i].alive = false;
              Empirebots[i].killed = xwinglazer.id;
            }
          }
        }
      });
      if (Empirebots[i].alive === false) {
        io.to(Empirebots[i].killed).emit('Killed_him', Empirebots[i].username);
        Empirebots.splice(i, 1);
        //       Empirebotboxes[i].dispose();
        Empirebotboxes.splice(i, 1);
        Ties.splice(i, 1);
        io.emit('imperial_died', i);
      }
    }
  }
  //   for (var i = 0; i < Empirebotboxes.length; i++) {
  //     if (Empirebots[i].alive === false) {
  //       io.to(Empirebots[i].killed).emit('Killed_him', Empirebots[i].username);
  //       Empirebots.splice(i, 1);
  // //       Empirebotboxes[i].dispose();
  //       Empirebotboxes.splice(i, 1);
  //       Ties.splice(i, 1);
  //       io.emit('imperial_died', i);
  //     }
  //   }

  for (var i = 0; i < Rebelbotboxes.length; i++) {
    if (Rebelbotboxes[i] != null) {
      Rebelbots[i].update(Rebelbotboxes[i]);
      Rebelbotboxes[i].translate(BABYLON.Axis.Z, 1.5, BABYLON.Space.LOCAL);
      var box = Rebelbotboxes[i];
      Tielazers.forEach(function(tielazer, index_lazer) {
        tielazer.translate(BABYLON.Axis.Z, 40, BABYLON.Space.LOCAL);
        tielazer.timeout -= 1;
        if (tielazer.timeout <= 0) {
          tielazer.dispose();
          Tielazers.splice(index_lazer, 1);
        } else {
          if (tielazer.intersectsMesh(Rebelbotboxes[i], false)) {
            Rebelbots[i].health -= 20;
            console.log(Rebelbots[i].health);
            if (Rebelbots[i].health <= 0) {
              Rebelbots[i].alive = false;
              Rebelbots[i].killed = tielazer.id;
            }
          }
        }
      });
      if (Rebelbots[i].alive === false) {
        io.to(Rebelbots[i].killed).emit('Killed_him', Rebelbots[i].username);
        Rebelbots.splice(i, 1);
        //       Rebelbotboxes[i].dispose();
        Rebelbotboxes.splice(i, 1);
        XWings.splice(i, 1);
        io.emit('rebel_died', i);
      }
    }
  }
  //   for (var i = 0; i < Rebelbotboxes.length; i++) {
  //     if (Rebelbots[i].alive === false) {
  //       io.to(Rebelbots[i].killed).emit('Killed_him', Rebelbots[i].username);
  //       Rebelbots.splice(i, 1);
  //       //       Rebelbotboxes[i].dispose();
  //       Rebelbotboxes.splice(i, 1);
  //       XWings.splice(i, 1);
  //       io.emit('rebel_died', i);
  //     }
  //   }
  scene.render();
});
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////OTHER Stuffs////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


//I didn't make any of this AI code cus I'm not smart
function facePoint(rotatingObject, pointToRotateTo) {

  // a directional vector from one object to the other one
  var direction = pointToRotateTo.subtract(rotatingObject.position);
  var distanceToTargetPoint = direction.length();

  if (distanceToTargetPoint > 0.5) {

    var axisVectorY = new BABYLON.Vector3(0, 0, 1);
    var directionAxisForY = 'x';
    var deltaY = calculateRotationDeltaForAxis(rotatingObject, 'y', axisVectorY, direction, directionAxisForY);

    var axisVectorZ = new BABYLON.Vector3(0, 1, 0);
    var directionAxisForZ = 'z';
    var deltaZ = calculateRotationDeltaForAxis(rotatingObject, 'z', axisVectorZ, direction, directionAxisForZ);

    var turnAroundYAxisDone = applyRotationForAxis(rotatingObject, 'y', deltaY);
    var turnAroundZAxisDone = applyRotationForAxis(rotatingObject, 'z', deltaZ);

    return (turnAroundYAxisDone && turnAroundZAxisDone) ? true : false;

  }
}

function faceTarget(rotatingObject, target) {
  var targetpos = new BABYLON.Vector3(target.x, target.y, target.z);
  return facePoint(rotatingObject, targetpos);
}

function calculateRotationDeltaForAxis(rotatingObject, axis, axisVector, direction, directionAxis) {
  var axisVectorNormalized = axisVector.normalize();
  var directionVectorNormalized = direction.normalize();

  // calculate the angel for the new direction
  var angle = Math.acos(BABYLON.Vector3.Dot(axisVectorNormalized, directionVectorNormalized));

  if (directionAxis == 'x') {
    // decide it the angle has to be positive or negative
    if (direction[directionAxis] < 0) angle *= -1;
    // compensate initial rotation of imported spaceship mesh
  } else {
    angle -= Math.PI / 2;
  }

  // calculate both angles in degrees
  var playerRotationOnAxis = rotatingObject.rotation[axis];
  // calculate and return the delta
  return playerRotationOnAxis - angle;
}

function applyRotationForAxis(rotatingObject, axis, delta) {
  var pi = Math.PI;

  // check what direction to turn to take the shortest turn
  if (delta > pi) {
    delta -= pi * 2;
  } else if (delta < -pi) {
    delta += pi * 2;
  }

  var absDelta = Math.abs(delta);
  // rotate until the difference between the object angle and the target angle is no more than 3 degrees
  if (absDelta > 0.0349066) {

    var rotationSpeed = Math.max(0.2, Math.min(absDelta * absDelta, 1));

    if (delta > 0) {
      rotatingObject.rotation[axis] -= rotationSpeed * 0.02;
      if (rotatingObject.rotation[axis] < -pi) {
        rotatingObject.rotation[axis] = pi;
      }
    }
    if (delta < 0) {
      rotatingObject.rotation[axis] += rotationSpeed * 0.02;
      if (rotatingObject.rotation[axis] > pi) {
        rotatingObject.rotation[axis] = -pi;
      }
    }

  }
  if (absDelta <= 0.261799) {
    // turn done
    return true;
  }
}



function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}