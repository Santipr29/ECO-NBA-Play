let ballImg;
let startDrag;
let ballLaunched = false;
const socket = io.connect('http://localhost:5500', {path: '/real-time'});

function preload() {
    ballImg = loadImage('img/balon.png');
}

function setup() {
    createCanvas(390, 844);
    ball = new Ball(138, 380);

    socket.on('ballDropped', () => {
        ball.reset();
        ballLaunched = false;
    });
}

function draw() {
    background(220);
    ball.show();
    ball.update();
}

class Ball {
    constructor(x, y) {
      this.startPos = createVector(x, y);
      this.pos = this.startPos.copy();
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
    }
    
    show() {
        image(ballImg, this.pos.x, this.pos.y, 120, 120); 
    }
  
    update() {
  
      this.vel.add(this.acc);
      this.pos.add(this.vel);
  
      this.acc.mult(0);

      if (this.pos.x < 0 || this.pos.x > width) {
        this.reset();
        ballLaunched = false;
    }
    }
    
    reset() {
      this.pos = this.startPos.copy();
      this.vel.mult(0);
      this.acc.mult(0);
    }
  
    launch(direction) {
      const dir = direction.copy().normalize();
      this.vel = dir.mult(direction.mag() * 0.1);
      this.acc.mult(0);
    }
}

function touchStarted() {
    startDrag = createVector(mouseX, mouseY);
}

function touchEnded() {
    const endDrag = createVector(mouseX, mouseY);
    const dragVector = p5.Vector.sub(endDrag, startDrag);
    ball.launch(dragVector);
    socket.emit('launchBall', { x: dragVector.x, y: dragVector.y });
}