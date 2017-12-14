var Play_Game_As_Rebel = function() {
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 0, 0), scene);
  //local box that is manuvered,locally
  playerbox = BABYLON.Mesh.CreateBox("playerbox", 20, scene);
  //testing laging in the movement
  lagbox = BABYLON.Mesh.CreateBox("lagbox", 10, scene);
  //the box that the camera is a parent of. This box is a parent of lagbox. Playerseption?
  camerabox = BABYLON.Mesh.CreateBox("camerabox", 10, scene);
  // var warningbounds = BABYLON.Mesh.CreateBox("warningbounds", 2000, scene);
  // var bounds = BABYLON.Mesh.CreateBox("Bounds", 3000, scene);
  // warningbounds.visibility = 0;
  // bounds.visibility = 0;
  //setting position and visibility of each of the boxes
  camerabox.visibility = 0;
  camerabox.setPivotMatrix(BABYLON.Matrix.Translation(0, 5, -13));
  lagbox.visibility = 0;
  camerabox.parent = playerbox;
  playerbox.visibility = 0;
  playerbox.position.z = -100;
  health = 100;
  var velocity = 2;
  var selfmodel = xwingorig.clone('selfmodel');
  selfmodel.visibility = 1;
  selfmodel.parent = playerbox;

  //making the actual camera
  camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -55), scene);

  //setting the parent of camera to labox so that it moves with it
  camera.parent = camerabox;
  camera.maxZ = 200000;


  //particle shit
  var ps = new BABYLON.ParticleSystem("particles", 1300, scene);
  ps.startPositionFunction = myStartPositionFunction;
  ps.updateFunction = myUpdateFunction;

  // Texture of each particle - set far below
  ps.particleTexture = new BABYLON.Texture("Models/star.png", scene);
  //ps.particleTexture = new BABYLON.Texture("https://cdn.rawgit.com/wingnutt/misc/master/star.jpg", scene);

  // Where the particles come from
  ps.emitter = new BABYLON.Vector3(0, 15, 0);

  ps.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
  ps.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To...


  // the sizing.
  ps.minSize = 100;
  ps.maxSize = 120;

  // Life time of each particle (random between...
  ps.minLifeTime = 40000.0;
  ps.maxLifeTime = 50000.0;

  // Emission rate
  ps.emitRate = 5000;

  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

  // Angular speed, in radians
  ps.minAngularSpeed = 0;
  // ps.maxAngularSpeed = Math.PI*2;
  ps.maxAngularSpeed = 0;

  // Speed
  ps.minEmitPower = 0;
  ps.maxEmitPower = 0;
  ps.updateSpeed = 0.005;

  // Start the particle system
  ps.start();


  //We come from the server. Nah just kidding this is all the pinging between the server and the local players

  //gather my the socket id
  socket.on('ID', function(data) {
    selfid = data;
  });

  //push all of the existing players for xwings
  socket.on('XWings', function(data) {
    for (var i = 0; i < data.length; i++) {
      XWings.push(new XWing(i, 0, 0, -100, 0, 0, 0, data[i].username, data[i].id));
    }
  });

  //push all of the existing players for ties
  socket.on('Ties', function(data) {
    for (var i = 0; i < data.length; i++) {
      Ties.push(new Tie(i, 0, 0, -100, 0, 0, 0, data[i].username, data[i].id));
    }
  });

  //handle incoming rebels
  socket.on('new rebel', function(data) {
    var place = XWings.length;
    XWings.push(new XWing(place, 0, 0, 0, 0, 0, 0, data.username, data.id));
  });

  //handle incoming imperials
  socket.on('new imperial', function(data) {
    var place = Ties.length;
    Ties.push(new Tie(place, 0, 0, 0, 0, 0, 0, data.username, data.id));
  });
  socket.on('new_rebel_shot', function(data) {
    var place = XWinglazers.length + 1;
    var newlazerthing = BABYLON.Mesh.CreateBox("XWinglazers[" + place + "]", 10, scene);
    newlazerthing.visibility = 0;
    newlazerthing.position.x = data.x
    newlazerthing.position.y = data.y
    newlazerthing.position.z = data.z
    newlazerthing.rotation.x = data.rotationx
    newlazerthing.rotation.y = data.rotationy
    newlazerthing.rotation.z = data.rotationz
    newlazerthing.timeout = 60;
    newlazerthing.id = data.id;
    newlazerthing.username = data.username;
    XWinglazers.push(newlazerthing);
    makeXWingLazer(place, newlazerthing);
  });
  socket.on('new_empire_shot', function(data) {
    var place = Tielazers.length + 1;
    var newlazerthing = BABYLON.Mesh.CreateBox("Tielazers[" + place + "]", 20, scene);
    newlazerthing.visibility = 0;
    newlazerthing.position.x = data.x
    newlazerthing.position.y = data.y
    newlazerthing.position.z = data.z
    newlazerthing.rotation.x = data.rotationx
    newlazerthing.rotation.y = data.rotationy
    newlazerthing.rotation.z = data.rotationz
    newlazerthing.timeout = 60;
    newlazerthing.id = data.id;
    newlazerthing.username = data.username;
    Tielazers.push(newlazerthing);
    makeTieLazer(place, newlazerthing);
  });


  //handle leaving players
  socket.on('rebel_left', function(i) {
    XWings[i].destroy();
    XWings.splice(i, 1);
  });

  //handle leaving players
  socket.on('imperial_left', function(i) {
    Ties[i].destroy();
    Ties.splice(i, 1);
  });

  //handle dead players
  socket.on('rebel_died', function(i) {
    let newblast = new makeBlast(0, XWings[i].xwing.position);
    newblast.start();
    Blasts.push(newblast);
    XWings[i].destroy();
    XWings.splice(i, 1);
  });

  //handle dead players
  socket.on('imperial_died', function(i) {
    let newblast = new makeBlast(0, Ties[i].tie.position);
    newblast.start();
    Blasts.push(newblast);
    Ties[i].destroy();
    Ties.splice(i, 1);
  });
  socket.on('Killed_him', function(username) {
    selfkills.unshift(username);
  });
  setInterval(function() {
//     XWinglazers.forEach(function(xwinglazer, i) {
//       XWinglazermodels.forEach(function(xwinglazermodel, j) {
//         if (xwinglazer.timeout < 0) {
//           xwinglazermodel.visibility = 0;
//           xwinglazermodel.dispose();
//           XWinglazermodels.splice(j, 1);
//           xwinglazer.dispose();
//           XWinglazers.splice(i, 1);
//         }
//       });
//     });
//     Tielazers.forEach(function(tielazer, i) {
//       Tielazermodels.forEach(function(tielazermodel, j) {
//         if (tielazer.timeout < 0) {
//           tielazermodel.visibility = 0;
//           tielazermodel.dispose();
//           Tielazermodels.splice(j, 1);
//           tielazer.dispose();
//           Tielazers.splice(i, 1);
//         }
//       });
//     });

    for (var i = Blasts.length - 1; i >= 0; i--) {
      let specificblast = Blasts[i];
      if (Blasts[i].killtime < 0) {
        specificblast.stop();
        Blasts.splice(i, 1);
      }
    }
    // if (playerbox.intersectsMesh(warningbounds, false)) {
    //   outsidewarning = false
    // } else {
    //   outsidewarning = true;
    // }
    // if (playerbox.intersectsMesh(bounds, false)) {
    //   outside = false;
    // } else {
    //   outside = true;
    // }
    // if(outside === true){
    //   selfmodel.visibility = 0;
    //   alive = false;
    //   health = 0;
    //   socket.emit('dead_rebel', "fuck");
    // }
  }, 1000);
  setInterval(function() {
    //handling position of rebels
    socket.on('heartbeat_rebel', function(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        let newposition = new BABYLON.Vector3(data[i].x, data[i].y, data[i].z);
        let newrotation = new BABYLON.Vector3(data[i].rotationx, data[i].rotationy, data[i].rotationz);
        XWings[i].setposition(newposition, newrotation);
      }
    });

    //handling position of rebels
    socket.on('heartbeat_empire', function(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        let newposition = new BABYLON.Vector3(data[i].x, data[i].y, data[i].z);
        let newrotation = new BABYLON.Vector3(data[i].rotationx, data[i].rotationy, data[i].rotationz);
        Ties[i].setposition(newposition, newrotation);
      }
    });
  }, 1);
  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function() {
    if (keys.left) { //A
      MouseX = -300;
    } else if (keys.right) { //D
      MouseX = 300;
    } else {
      MouseX = 0;
    }
    if (keys.up) { //W
      MouseY = -200;
    } else if (keys.down) { //S
      MouseY = 200;
    } else {
      MouseY = 0;
    }

    scene.getMeshByName("playerbox").addRotation(MouseY * 0.00007, 0, 0);
    scene.getMeshByName("playerbox").addRotation(0, MouseX * 0.00007, 0);

    var mousexsubtrackmousex = -MouseX - trackmousex;
    scene.getMeshByName("playerbox").addRotation(0, 0, mousexsubtrackmousex * 0.0007);
    trackmousex = -MouseX;
    var playerbox = scene.getMeshByName("playerbox");
    scene.getMeshByName("playerbox").translate(BABYLON.Axis.Z, velocity, BABYLON.Space.LOCAL);
    // scene.getMeshByName("lagbox").position = scene.getMeshByName("playerbox").position;
    // var lagrotation = BABYLON.Vector3.Lerp(scene.getMeshByName("lagbox").rotation, scene.getMeshByName("playerbox").rotation, 1);
    // scene.getMeshByName("lagbox").rotation = lagrotation;
    for (var i = XWings.length - 1; i >= 0; i--) {
      XWings[i].update();
    }
    for (var i = Ties.length - 1; i >= 0; i--) {
      Ties[i].update();
    }

    XWinglazers.forEach(function(xwinglazer, index_lazer) {
      xwinglazer.translate(BABYLON.Axis.Z, 40, BABYLON.Space.LOCAL);
      xwinglazer.timeout -= 1;
      XWinglazermodels.forEach(function(xwinglazermodel, j) {
        if (xwinglazer.timeout < 0) {
          xwinglazermodel.visibility = 0;
          xwinglazermodel.dispose();
          XWinglazermodels.splice(j, 1);
          xwinglazer.dispose();
          XWinglazers.splice(index_lazer, 1);
        }
      });
      Ties.forEach(function(tie, index_tie) {
        if (xwinglazer.intersectsMesh(tie.tie, false) && xwinglazer.timeout > 0) {
          XWinglazermodels[index_lazer].visibility = 0;
          XWinglazermodels.splice(index_lazer, 1);
          XWinglazers.splice(index_lazer, 1);
        }
      });
    });
    Tielazers.forEach(function(tielazer, index_lazer) {
      tielazer.translate(BABYLON.Axis.Z, 40, BABYLON.Space.LOCAL);
      tielazer.timeout -= 1;
      Tielazermodels.forEach(function(tielazermodel, j) {
        if (tielazer.timeout < 0) {
          tielazermodel.visibility = 0;
          tielazermodel.dispose();
          Tielazermodels.splice(j, 1);
          tielazer.dispose();
          Tielazers.splice(index_lazer, 1);
        }
      });
      XWings.forEach(function(xwing, index_xwing) {
        if (tielazer.intersectsMesh(xwing.xwing, false) && tielazer.timeout > 0) {
          if (tielazer.intersectsMesh(playerbox, false)) {
            health -= 20;
            if (health <= 0) {
              selfmodel.visibility = 0;
              killed = tielazer.username;
              socket.emit('dead_rebel', tielazer.id);
              alive = false;
            }
            Tielazermodels[index_lazer].visibility = 0;
            Tielazermodels.splice(index_lazer, 1);
            Tielazers.splice(index_lazer, 1);
          } else {
            Tielazermodels[index_lazer].visibility = 0;
            Tielazermodels.splice(index_lazer, 1);
            Tielazers.splice(index_lazer, 1);
          }

        }
      });
    });

    for (var i = Blasts.length - 1; i >= 0; i--) {
      Blasts[i].killtime -= 1;
    }

    var data = {
      x: playerbox.position.x,
      y: playerbox.position.y,
      z: playerbox.position.z,
      rotationx: playerbox.rotation.x,
      rotationy: playerbox.rotation.y,
      rotationz: playerbox.rotation.z,
      id: selfid,
      controlX: MouseX,
      controlY: MouseY,
      username: username
    };
    if (alive) {
      socket.emit('update_rebel', data);
    } else {
      velocity = 0;
    }
    if (keys.space) {
      socket.emit('rebel_shoot', data);
      keys.space = false;
    }
    scene.render();
  });

};
