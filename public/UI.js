var sketch = function(p5) {

  p5.setup = function() {
    let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.position = (200, 200);
    canvas.parent('sketch-holder');
    p5.angleMode(p5.DEGREES)
  };

  p5.draw = function() {
    p5.clear();
    if (playing === false && loaded === true) {
      p5.background(0);
    } else {
      p5.background(0, 0);
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
    socket.on('numbers', function(XWingslength, Tieslength){
      p5.stroke(255);
      p5.fill(255);
      p5.textAlign(p5.CENTER);
      p5.textSize(20);
      p5.text(XWingslength, p5.windowWidth - 20, p5.windowHeight + 20);
      p5.text(Tieslength, p5.windowWidth - 20, p5.windowHeight + 40);
      console.log("stuff");
    });
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
