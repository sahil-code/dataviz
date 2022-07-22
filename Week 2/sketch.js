let r, g, b, diam;

function setup() {
  createCanvas(600, 400);
  r = 33;
  g = 41;
  b = 32;
  diam = 60;
}

function draw() {
  background(r, g, b);

  noStroke();
  fill(228, 232, 228);
  circle(300, 200, 160);
  circle(440, 200, 80);
  circle(160, 200, 80);
  circle(300, 340, 80);
  circle(300, 60, 80);

  fill(r, g, b);
  circle(300, 200, diam);
}

// When the user clicks the mouse
function mousePressed() {
  // Check if mouse is inside the circle
  let d = dist(mouseX, mouseY, 300, 200);
  if (d < diam / 2) {
    if (r == 33) {
      r = 150;
    } else {
      r = 33;
    }
    if (diam < 160) {
      diam += 10;
    } else {
      r = 0;
      g = 0;
      b = 0;
      diam +=1
      
    }
  }
}
