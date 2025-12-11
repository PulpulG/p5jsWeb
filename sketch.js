// Pure mathematical marbling with only drops — interactive + endless loop
// Click and drop.

let drops = [];
let colors = [
  "#8b4513",
  "#568203",
  "#cc5500",
  "#e1ad01",
  "#aa381e",
  "#ffd801",
  "#ff1493",
  "#006994"
];
;

let VerticesNO = 30;
let bgColor, noiseAmount;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noiseAmount = height / 2;
  bgColor = 0;
}

function draw() {
  clear();
  background(bgColor);

  // Automatic small random drops forever
  if (frameCount % 8 === 0) {
    let x = noise(frameCount * 0.05) * width;
    let y = random(height);
    let r = random(2, noiseAmount * 0.03);
    addInk(x, y, r, random(colors));
  }

  // Animate and draw every drop
  for (let d of drops) {
    d.grow();
    d.show();
  }
}

// Interaction — click to add ink
function mousePressed() {
  let r = random(noiseAmount * 0.01, noiseAmount * 0.04);
  addInk(mouseX, mouseY, r, random(colors));
}

// Add ink drop + marble everything
function addInk(x, y, r, color) {
  let newDrop = new drop(x, y, r, color);

  // New drop pushes all old drops
  for (let other of drops) {
    other.marble(newDrop);
  }

  drops.push(newDrop);
}

// DROP CLASS
class drop {
  constructor(x, y, r, color) {
    this.pos = createVector(x, y);
    this.r = 1;
    this.finalR = r;
    this.color = color;

    this.points = [];
    for (let i = 0; i < VerticesNO; i++) {
      let angle = map(i, 0, VerticesNO, 0, TAU);
      this.points.push(createVector(
        x + cos(angle) * r,
        y + sin(angle) * r
      ));
    }
  }

  grow() {
    if (this.r < this.finalR) {
      this.r += 0.2;

      // Growing drop distorts all other drops
      for (let other of drops) {
        other.marble(this);
      }
    }
  }

  marble(other) {
    for (let pt of this.points) {
      let c = other.pos;
      let p = pt.copy();
      let r = other.r;

      p.sub(c);
      let m = p.mag();
      let root = sqrt(1 + (r * r) / (m * m));
      p.mult(root);
      p.add(c);

      pt.set(p);
    }
  }

  show() {
    fill(this.color);
    noStroke();
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];

      // fuzzy distortion
      let nx = noise(p.x * 0.01, p.y * 0.01, frameCount * 0.01);
      let ny = noise(p.y * 0.01, p.x * 0.01, frameCount * 0.01);

      let fx = map(nx, 0, 1, -2, 2);
      let fy = map(ny, 0, 1, -2, 2);

      vertex(p.x + fx, p.y + fy);
    }
    endShape(CLOSE);
  }
}

// Fullscreen resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  noiseAmount = height / 2;
}
