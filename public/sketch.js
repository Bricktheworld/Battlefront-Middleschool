var MouseX = 0;
var MouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var allmeshes = [];
var xwingorig;
var xwinglazerorig;
var XWinglazers = [];
var XWings = [];
var XWing_Engine_Sound;
var tieorig;
var tielazerorig;
var Tielazers = [];
var Ties = [];
var Blasts = [];
var selfkills = [];
var alive = true;
var outside = false;
var outsidewarning = false;
var Nebulon = [];
var killed;
var health;
var socket;
var playerbox;
var camerabox;
var lagbox;
var trackmousex = 0;
var selfid;
var playing = false;
var shooting = false;
var team;
var Tantive;
var keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false
}
var loaded = false;
var trackercolorrebel;
var trackercolorempire;

// -------------------------------------------Start Writing Important Stuff-------------------------------------------------------\\
var canvas = document.getElementById('canvas');
var engine = new BABYLON.Engine(canvas, true);
window.addEventListener("resize", function() { // Watch for browser/canvas resize events
  engine.resize();
});
window.addEventListener("keydown", handleKeyDown, false);
window.addEventListener("keyup", handleKeyUp, false);

function handleKeyDown(evt) {
  if (evt.keyCode == 65 || evt.keyCode == 37) { //A
    keys.left = true;
  } else if (evt.keyCode == 68 || evt.keyCode == 39) { //D
    keys.right = true;
  }
  if (evt.keyCode == 87 || evt.keyCode == 38) { //W
    keys.up = true;
  } else if (evt.keyCode == 83 || evt.keyCode == 40) { //S
    keys.down = true;
  }
  if (evt.keyCode == 32) { //space
    keys.space = true;
  }
}

function handleKeyUp(evt) {
  if (evt.keyCode == 65 || evt.keyCode == 37) { //A
    keys.left = false;
  } else if (evt.keyCode == 68 || evt.keyCode == 39) { //D
    keys.right = false;
  }
  if (evt.keyCode == 87 || evt.keyCode == 38) { //W
    keys.up = false;
  } else if (evt.keyCode == 83 || evt.keyCode == 40) { //S
    keys.down = false;
  }
  if (evt.keyCode == 32) { //space
    keys.space = false
  }
}
var scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3.Black();
engine.enableOfflineSupport = false;
var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
socket = io();
var domeRadius = 7000;
var randomNumber = function(min, max) {
  if (min === max) {
    return (min);
  }
  var random = Math.random();
  return ((random * (max - min)) + min);
};

// Wingy's default positions
var myStartPositionFunction = function(worldMatrix, positionToUpdate) {
  var v3 = getCart(domeRadius);
  BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(v3.x, v3.y, v3.z, worldMatrix, positionToUpdate);
};

// -------------------------------------------------------------------------------------------------
var myUpdateFunction = function(particles) {
  for (var index = 0; index < particles.length; index++) {
    var particle = particles[index];
    particle.age += this._scaledUpdateSpeed;
    if (particle.age >= particle.lifeTime) {
      this.recycleParticle(particle);
      index--;
      continue;
    } else {

      particle.color = new BABYLON.Color3.White();
      particle.size = randomNumber(this.minSize, this.maxSize);

      if (particle.color.a < 0)
        particle.color.a = 0;
    }
  }
};

// -----------------------------------------------------------------------
// a gruesome stolen func - thx to...
// https://rbrundritt.wordpress.com/2008/10/14/conversion-between-spherical-and-cartesian-coordinates-systems/
function getCart(radius) {
  // var lat = DegtoRad (latlong.Latitude);
  // var lon = DegtoRad (latlong.Longitude);
  var xy = plot1(); // just below
  var lat = xy[0];
  var lon = xy[1];
  var x = radius * Math.cos(lat) * Math.cos(lon);
  var y = radius * Math.cos(lat) * Math.sin(lon);
  var z = radius * Math.sin(lat);
  return new BABYLON.Vector3(x, y, z);
}

// -----------------------------------------------------------------------
// a stolen formula - claims to eliminate polar bias (clustering near poles)
// in use - thx to http://rectangleworld.com/blog/archives/298
var plot1 = function() {
  var theta = Math.random() * 2 * Math.PI;
  var phi = Math.acos(Math.random() * 2 - 1);
  return [theta, phi];
};

// -----------------------------------------------------------------------
var doubleColor4 = function(min, max) {
  return new BABYLON.Color4(Math.random() * 2, Math.random() * 2, Math.random() * 2, Math.random());
}

function onDocumentMouseMove(event) {
  MouseX = (event.clientX - windowHalfX);
  MouseY = (event.clientY - windowHalfY);
}

function Shoot(position) {
  shooting = true;
}
var Pannel = {
  toggleChatInput: function() {
    $("#chatInput").toggle();
    if ($("#chatInput").css("display") == "block") {
      $("#chatInputField").focus();
      //Key.disabled = true;
      return true;
    } else {
      //Key.disabled = false;
      $("#chatInputField").blur();
      return false;
    }
  }
}
var assetsManager = new BABYLON.AssetsManager(scene);
var XWingTask = assetsManager.addMeshTask("XWing", "", "Models/", "XWing.babylon");
var XWingLazerTask = assetsManager.addMeshTask("XWingLazer", "", "Models/", "XWingLazers.babylon");
// var NebulonTask = assetsManager.addMeshTask("Nebulon", "", "Models/", "NebulonB.babylon");
var TieTask = assetsManager.addMeshTask("Tie", "", "Models/", "Tie.babylon");
var TieLazerTask = assetsManager.addMeshTask("TieLazer", "", "Models/", "TieLazers.babylon");
var XWingEngineTask = assetsManager.addBinaryFileTask("XWing Engine task", "Sounds/X-wing_Sounds/XWingEngine.wav");
XWingEngineTask.onSuccess = function(task) {
  XWing_Engine_Sound = new BABYLON.Sound("XWing Engine Sound", task.data, scene, null, {
    loop: true,
    autoplay: false
  });
}


//_____________________________________________LOAD MESHES!!!!!!!!!!!!!!!!!!!!_________________________________________________________
// NebulonTask.onSuccess = function(task) {
//   for(var i = 0; i <= 9; i++){
//     Nebulon.push(task.loadedMeshes[i]);
//   }
// }
XWingTask.onSuccess = function(task) {
  xwingorig = task.loadedMeshes[0];
  xwingorig.visibility = 0;
}
XWingLazerTask.onSuccess = function(task) {
  xwinglazerorig = task.loadedMeshes[0];
  xwinglazerorig.visibility = 0;
}
// TantiveTask.onSuccess = function(task) {
//   Tantive = task.loadedMeshes[0];
//   task.loadedMeshes[0].scaling = new BABYLON.Vector3(100, 100, 100);
//   task.loadedMeshes[0].position = new BABYLON.Vector3(0, 0, -900);
//
// }
TieTask.onSuccess = function(task) {
  tieorig = task.loadedMeshes[0];
  tieorig.visibility = 0;
}
TieLazerTask.onSuccess = function(task) {
  tielazerorig = task.loadedMeshes[0];
  tielazerorig.visibility = 0;
}

assetsManager.onFinish = function(task) {
  loaded = true;
  document.getElementById('JoinRebelButton').style.zIndex = 900;
  document.getElementById('JoinEmpireButton').style.zIndex = 900;
  Start();
}

assetsManager.load();

function makeXWing(number, parent) {
  let mesh = xwingorig.clone('XWing' + number);
  mesh.parent = parent;
  mesh.visibility = 1;
  XWingmodels.push(mesh);
}

function makeXWingLazer(number, parent) {
  let mesh = xwinglazerorig.clone('XWinglazer' + number);
  mesh.parent = parent;
  mesh.visibility = 1;
  mesh.timeout = 60;
  XWinglazermodels.push(mesh);
}

function makeTie(number, parent) {
  let mesh = tieorig.clone('Tie' + number);
  mesh.parent = parent;
  mesh.visibility = 1;
  Tiemodels.push(mesh);
}

function makeTieLazer(number, parent) {
  let mesh = tielazerorig.clone('Tielazer' + number);
  mesh.parent = parent;
  mesh.visibility = 1;
  mesh.timeout = 60;
  Tielazermodels.push(mesh);
}

function makeBlast(number, emitter) {
  var blast = new BABYLON.ParticleSystem("blast" + number, 100, scene);
  // Texture of each particle - set far below
  blast.particleTexture = new BABYLON.Texture("Models/Sparks.png", scene);

  // Where the particles come from
  blast.emitter = emitter;

  // blast.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
  // blast.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To...


  // the sizing.
  blast.minSize = 2;
  blast.maxSize = 4;

  // Life time of each particle (random between...
  blast.minLifeTime = 0.2;
  blast.maxLifeTime = 0.2;

  blast.manualEmitCount = 100;

  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  blast.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

  //direction
  blast.direction1 = new BABYLON.Vector3(-3, -3, -3);
  blast.direction2 = new BABYLON.Vector3(3, 3, 3);

  // Angular speed, in radians
  blast.minAngularSpeed = 0;
  // ps.maxAngularSpeed = Math.PI*2;
  blast.maxAngularSpeed = 0;

  // Speed
  blast.minEmitPower = 30;
  blast.maxEmitPower = 40;
  blast.updateSpeed = 0.005;

  blast.targetStopDuration = 10;
  blast.disposeOnStop = true;
  blast.killtime = 10;

  // Start the particle system
  // blast.start();
  // Blasts.push(blast);
  return blast;
}

var JoinRebel = function() {
  document.getElementById('JoinRebelButton').style.zIndex = -900;
  document.getElementById('JoinEmpireButton').style.zIndex = -900;
  document.getElementById('UserNameField').style.zIndex = 900;
  team = "rebel";
}

function JoinEmpire() {
  document.getElementById('JoinRebelButton').style.zIndex = -900;
  document.getElementById('JoinEmpireButton').style.zIndex = -900;
  document.getElementById('UserNameField').style.zIndex = 900;
  team = "empire";
}

function SetUsername(input) {
  if (event.keyCode === 13 && playing === false && input.value !== "") {
    document.getElementById('UserNameField').style.zIndex = 900;
    username = input.value;
    let data = {
      team: team,
      username: username
    }
    socket.emit('startdata', data);
    playing = true;
  }

}

function Start() {
  socket.on('entergame', function() {
    document.getElementById('UserNameField').style.zIndex = -900;
    playing = true;
    if (team == "rebel") {
      Play_Game_As_Rebel();
    } else if (team == "empire") {
      Play_Game_As_Imperial();
    }
  });
}
