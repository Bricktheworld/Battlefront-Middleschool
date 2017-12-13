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
    this.xwingmodel.visibility = 0;
  } else {
    this.pin.alpha = 1;
  }
  advancedTexture.addControl(this.pin);
  this.pin.linkWithMesh(this.xwing);
  this.pin.linkOffsetY = -30;
}
XWing.prototype.update = function() {
  this.xwing.translate(BABYLON.Axis.Z, 2, BABYLON.Space.LOCAL);
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
    this.tiemodel.visibility = 0;
  } else {
    this.pin.alpha = 1;
  }
  advancedTexture.addControl(this.pin);
  this.pin.linkWithMesh(this.tie);
  this.pin.linkOffsetY = -30;
}
Tie.prototype.update = function() {
  this.tie.translate(BABYLON.Axis.Z, 2, BABYLON.Space.LOCAL);
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
