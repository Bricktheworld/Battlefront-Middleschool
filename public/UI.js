var sketch = function(p5) {
  p5.setup = function() {
    let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.position = (200, 200);
    canvas.parent('sketch-holder');
    p5.angleMode(p5.DEGREES);

  };

  p5.draw = function() {
    p5.clear();
    if (playing === false && loaded === true) {
      p5.background(0);
    } else {
      p5.background(0, 0);
      if (team == "rebel") {
        trackercolorrebel = p5.color(0, 0, 255);
        trackercolorempire = p5.color(255, 0, 0);
      } else if (team == "empire") {
        trackercolorempire = p5.color(0, 0, 255);
        trackercolorrebel = p5.color(255, 0, 0);
      }
    }
    health = p5.constrain(health, 0, 100);
    p5.fill(50, 150);
    p5.noStroke();
    p5.rectMode(p5.CENTER);
    p5.rect(p5.windowWidth / 2, p5.windowHeight * 7 / 8, 300, 50);
    p5.fill(255);
    p5.rectMode(p5.CORNER);
    p5.rect(p5.windowWidth / 2 - 150, p5.windowHeight * 7 / 8 - 25, health * 3, 50);
    for (var i = selfkills.length - 1; i >= 0; i--) {
      eliminate(selfkills[i], (p5.windowHeight / 2 + 60) + 50 * (i + 1), i);
    }
    p5.textSize(30);
    p5.stroke(255);
    p5.text("Kills: " + selfkills.length, 60, 60);
    // if (outsidewarning == true && outside == false && alive == true) {
    //   p5.noStroke();
    //   p5.fill(50, 80);
    //   p5.rectMode(p5.CORNER);
    //   p5.rect(0, 0, p5.windowWidth, p5.windowHeight);
    //   p5.textSize(80);
    //   p5.textAlign(p5.CENTER);
    //   p5.stroke(255);
    //   p5.fill(255);
    //   p5.text("Get back to battle!", p5.windowWidth / 2, p5.windowHeight / 2);
    // }
    // if (outside == true) {
    //   p5.noStroke();
    //   p5.fill(50, 80);
    //   p5.rectMode(p5.CORNER);
    //   p5.rect(0, 0, p5.windowWidth, p5.windowHeight);
    //   p5.textSize(80);
    //   p5.textAlign(p5.CENTER);
    //   p5.stroke(255);
    //   p5.fill(255);
    //   p5.text("You went too far from battle", p5.windowWidth / 2, p5.windowHeight / 2);
    // }
    if (alive === false) {
      p5.noStroke();
      p5.fill(50, 80);
      p5.rectMode(p5.CORNER);
      p5.rect(0, 0, p5.windowWidth, p5.windowHeight);
      p5.textSize(80);
      p5.textAlign(p5.CENTER);
      p5.stroke(255);
      p5.fill(255);
      p5.text(killed + " eliminated you", p5.windowWidth / 2, p5.windowHeight / 2)
    }
    p5.stroke(190);
    p5.strokeWeight(1);
    p5.fill(190);
    p5.ellipse(p5.windowWidth / 2, p5.windowHeight / 2, 2, 2);
    p5.line(p5.windowWidth / 2 + 20, p5.windowHeight / 2, p5.windowWidth / 2 + 60, p5.windowHeight / 2);
    p5.line(p5.windowWidth / 2 - 20, p5.windowHeight / 2, p5.windowWidth / 2 - 60, p5.windowHeight / 2);
    p5.line(p5.windowWidth / 2, p5.windowHeight / 2 - 20, p5.windowWidth / 2, p5.windowHeight / 2 - 60);
    p5.line(p5.windowWidth / 2, p5.windowHeight / 2 + 20, p5.windowWidth / 2, p5.windowHeight / 2 + 60);
    for (var i = XWings.length - 1; i >= 0; i--) {
      let trackerleft = p5.constrain(parseInt(XWings[i].pin.left), -p5.windowWidth / 2, p5.windowWidth / 2);
      let trackertop = p5.constrain(parseInt(XWings[i].pin.top), -p5.windowHeight / 2, p5.windowHeight / 2);
      if (XWings[i].tracking.offtop) {
        p5.push();
        p5.translate(p5.windowWidth / 2, p5.windowHeight / 2);
        p5.fill(trackercolorrebel);
        p5.noStroke();
        p5.ellipse(trackerleft, -p5.windowHeight / 2, 20, 20);
        p5.pop();
      } else if (XWings[i].tracking.offbottom) {
        p5.push();
        p5.translate(p5.windowWidth / 2, p5.windowHeight / 2);
        p5.fill(trackercolorrebel);
        p5.noStroke();
        p5.ellipse(trackerleft, p5.windowHeight / 2, 20, 20);
        p5.pop();
      }
      if (XWings[i].tracking.offleft) {
        p5.push();
        p5.translate(p5.windowWidth / 2, p5.windowHeight / 2);
        p5.fill(trackercolorrebel);
        p5.noStroke();
        p5.ellipse(-p5.windowWidth / 2, trackertop, 20, 20);
        p5.pop();
      } else if (XWings[i].tracking.offright) {
        p5.push();
        p5.translate(p5.windowWidth / 2, p5.windowHeight / 2);
        p5.fill(trackercolorrebel);
        p5.noStroke();
        p5.ellipse(p5.windowWidth / 2, trackertop, 20, 20);
        p5.pop();
      }
    }
    for (var i = Ties.length - 1; i >= 0; i--) {
      let trackerleft = p5.constrain(parseInt(Ties[i].pin.left), -p5.windowWidth / 2, p5.windowWidth / 2);
      let trackertop = p5.constrain(parseInt(Ties[i].pin.top), -p5.windowHeight / 2, p5.windowHeight / 2);
      if (Ties[i].tracking.offtop) {
        p5.push();
        p5.translate(p5.windowWidth / 2, p5.windowHeight / 2);
        p5.fill(trackercolorempire);
        p5.noStroke();
        p5.ellipse(trackerleft, -p5.windowHeight / 2, 20, 20);
        p5.pop();
      } else if (Ties[i].tracking.offbottom) {
        p5.push();
        p5.translate(p5.windowWidth / 2, p5.windowHeight / 2);
        p5.fill(trackercolorempire);
        p5.noStroke();
        p5.ellipse(trackerleft, p5.windowHeight / 2, 20, 20);
        p5.pop();
      }
      if (Ties[i].tracking.offleft) {
        p5.push();
        p5.translate(p5.windowWidth / 2, p5.windowHeight / 2);
        p5.fill(trackercolorempire);
        p5.noStroke();
        p5.ellipse(-p5.windowWidth / 2, trackertop, 20, 20);
        p5.pop();
      } else if (Ties[i].tracking.offright) {
        p5.push();
        p5.translate(p5.windowWidth / 2, p5.windowHeight / 2);
        p5.fill(trackercolorempire);
        p5.noStroke();
        p5.ellipse(p5.windowWidth / 2, trackertop, 20, 20);
        p5.pop();
      }
    }
  };
  eliminate = function(user, y, index) {
    if (index === 0) {
      p5.stroke(255, 255);
    } else {
      p5.stroke(255, 50);
    }
    p5.textSize(20);
    p5.textAlign(p5.CENTER);
    p5.text("eliminated" + " " + user, p5.windowWidth / 2, y);
  }
};

var myp5 = new p5(sketch, document.getElementById('sketch-holder'));