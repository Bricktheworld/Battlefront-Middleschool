function XWing(i, x, y, z, rotx, roty, rotz, usernm, id) {
  this.xwing = new BABYLON.Mesh.CreateBox("XWings[" + i + "]", 20, scene);
  this.position = new BABYLON.Vector3(x, y, z);
  this.rotation = new BABYLON.Vector3(rotx, roty, rotz);
  this.xwing.position = this.position;
  this.xwing.rotation = this.rotation;
  this.xwing.visibility = 0;
  this.xwingmodel = xwingorig.clone('XWing');
  this.xwingmodel.parent = this.xwing;
  this.xwingmodel.visibility = 1;
  this.username = usernm;
  this.self = false;
  this.pin = new BABYLON.GUI.TextBlock();
  this.pin.text = this.username;
  this.pin.fontSize = 10;
  if (team == "rebel") {
    this.pin.color = "#4286f4";
  } else {
    this.pin.color = "#f44141";
  }
  if (id == selfid) {
    this.pin.alpha = 0;
    this.self = true;
    //     camerabox.parent = this.xwing;
  } else {
    this.pin.alpha = 1;
  }
  advancedTexture.addControl(this.pin);
  this.pin.linkWithMesh(this.xwing);
  this.pin.linkOffsetY = -30;
  this.tracking = {
    offtop: false,
    offbottom: false,
    offright: false,
    offleft: false
  }
}
XWing.prototype.update = function() {
  this.xwing.translate(BABYLON.Axis.Z, 2, BABYLON.Space.LOCAL);
  if (parseInt(this.pin.top, 10) < -windowHalfY) {
    this.tracking.offtop = true;
  } else if (parseInt(this.pin.top, 10) > windowHalfY) {
    this.tracking.offbottom = true;
  } else {
    this.tracking.offtop = false;
    this.tracking.offbottom = false;
  }
  if (parseInt(this.pin.left, 10) > windowHalfX) {
    this.tracking.offright = true;
  } else if (parseInt(this.pin.left, 10) < -windowHalfX) {
    this.tracking.offleft = true;
  } else {
    this.tracking.offright = false;
    this.tracking.offleft = false;
  }

  if (this.self) {
    camerabox.position = this.xwing.position;
    camerabox.rotation = playerbox.rotation;
  }
}
XWing.prototype.setposition = function(newposition, newrotation) {
  this.xwing.position = newposition;
  this.xwing.rotation = newrotation;
  this.position = this.xwing.position;
  this.rotation = this.xwing.rotation;
}
XWing.prototype.destroy = function() {
  this.xwingmodel.visibility = 0;
  this.pin.alpha = 0;
  this.xwingmodel.dispose();
  this.xwing.dispose();
  //   camerabox.parent = playerbox;
}

function Tie(i, x, y, z, rotx, roty, rotz, usernm, id) {
  this.tie = new BABYLON.Mesh.CreateBox("XWings[" + i + "]", 20, scene);
  this.position = new BABYLON.Vector3(x, y, z);
  this.rotation = new BABYLON.Vector3(rotx, roty, rotz);
  this.tie.position = this.position;
  this.tie.rotation = this.rotation;
  this.tie.visibility = 0;
  this.tiemodel = tieorig.clone('XWing');
  this.tiemodel.parent = this.tie;
  this.tiemodel.visibility = 1;
  this.username = usernm;
  this.self = false;
  this.pin = new BABYLON.GUI.TextBlock();
  this.pin.text = this.username;
  this.pin.fontSize = 10;
  if (team == "empire") {
    this.pin.color = "#4286f4";
  } else {
    this.pin.color = "#f44141";
  }
  if (id === selfid) {
    this.pin.alpha = 0;
    this.self = true;
    //     camerabox.parent = this.tie;
  } else {
    this.pin.alpha = 1;
  }
  advancedTexture.addControl(this.pin);
  this.pin.linkWithMesh(this.tie);
  this.pin.linkOffsetY = -30;
  this.tracking = {
    offtop: false,
    offbottom: false,
    offright: false,
    offleft: false
  }
}
Tie.prototype.update = function() {
  this.tie.translate(BABYLON.Axis.Z, 2, BABYLON.Space.LOCAL);
  if (parseInt(this.pin.top, 10) < -windowHalfY) {
    this.tracking.offtop = true;
  } else if (parseInt(this.pin.top, 10) > windowHalfY) {
    this.tracking.offbottom = true;
  } else {
    this.tracking.offtop = false;
    this.tracking.offbottom = false;
  }
  if (parseInt(this.pin.left, 10) > windowHalfX) {
    this.tracking.offright = true;
  } else if (parseInt(this.pin.left, 10) < -windowHalfX) {
    this.tracking.offleft = true;
  } else {
    this.tracking.offright = false;
    this.tracking.offleft = false;
  }

  if (this.self) {
    camerabox.position = this.tie.position;
    camerabox.rotation = playerbox.rotation;
  }
}
Tie.prototype.setposition = function(newposition, newrotation) {
  this.tie.position = newposition;
  this.tie.rotation = newrotation;
  this.position = this.tie.position;
  this.rotation = this.tie.rotation;
}

Tie.prototype.destroy = function() {
  this.tiemodel.visibility = 0;
  this.pin.alpha = 0;
  this.tiemodel.dispose();
  this.tie.dispose();
}

function XWinglazer(x, y, z, rotx, roty, rotz, id, username) {
  this.lazer = BABYLON.Mesh.CreateBox("XWinglazer", 10, scene);
  this.lazer.visibility = 0;
  this.lazer.position.x = x
  this.lazer.position.y = y
  this.lazer.position.z = z
  this.lazer.rotation.x = rotx
  this.lazer.rotation.y = roty
  this.lazer.rotation.z = rotz
  this.timeout = 60;
  this.id = id;
  this.username = username;
  this.model = xwinglazerorig.clone('XWinglazer');
  this.model.visibility = 1;
  this.model.parent = this.lazer;
}
XWinglazer.prototype.update = function() {
  this.lazer.translate(BABYLON.Axis.Z, 40, BABYLON.Space.LOCAL);
  this.timeout -= 1;
}

XWinglazer.prototype.check = function() {
  if (this.timeout <= 0) {
    return true
  } else {
    return false
  }
}
XWinglazer.prototype.destroy = function() {
  this.lazer.dispose();
  this.model.visibility = 0;
  this.model.dispose();
}
function Tielazer(x, y, z, rotx, roty, rotz, id, username) {
  this.lazer = BABYLON.Mesh.CreateBox("Tielazer", 20, scene);
  this.lazer.visibility = 0;
  this.lazer.position.x = x
  this.lazer.position.y = y
  this.lazer.position.z = z
  this.lazer.rotation.x = rotx
  this.lazer.rotation.y = roty
  this.lazer.rotation.z = rotz
  this.timeout = 60;
  this.id = id;
  this.username = username;
  this.model = tielazerorig.clone('Tielazer');
  this.model.visibility = 1;
  this.model.parent = this.lazer;
}
Tielazer.prototype.update = function() {
  this.lazer.translate(BABYLON.Axis.Z, 40, BABYLON.Space.LOCAL);
  this.timeout -= 1;
}

Tielazer.prototype.check = function() {
  if (this.timeout <= 0) {
    return true
  } else {
    return false
  }
}
Tielazer.prototype.destroy = function() {
  this.lazer.dispose();
  this.model.visibility = 0;
  this.model.dispose();
}