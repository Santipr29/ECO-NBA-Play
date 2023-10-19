let ballImg, post, basket;
let startDrag;
let score = 0;
let ballFalling = false;
let enteredBasket = false;
let ballSize = 50; 
let prevPosY = 0;

function preload() {
  ballImg = loadImage('img/balon.png');
  post = loadImage('img/palo.png');
  basket = loadImage('img/aro.png');
}

function setup() {
  createCanvas(600, 658);
  ball = new Ball(230, 520);
}

let basketX = 230;
let basketSpeed = 0;
let basketDir = 1;

function draw() {
  background(220);

  if(score >= 10 && basketSpeed == 0){
    basketSpeed = 2;
  }else if(score >= 20 && basketSpeed == 2){
    basketSpeed = 4;
  }else if(score >= 35 && basketSpeed == 4){
    basketSpeed = 6;
  }

  basketX += basketSpeed * basketDir;

  if(basketX <= 0 || basketX >= width - 100){
    basketDir *= -1;
  }

  image(post, basketX - 80, 50, 250, 700);
  image(basket, basketX, 180, 100, 100);

  // Ajusta las coordenadas del área de juego en el eje X
  let minX = 200; // Cambia esto según tus necesidades
  let maxX = 300; // Cambia esto según tus necesidades

  textSize(24);
  fill(0);
  text("Puntos: " + score, 10, 30);

  ball.show();
  ball.update();
  checkBasketEntry(minX, maxX);
}

class Ball {
  constructor(x, y) {
    this.startPos = createVector(x, y);
    this.pos = this.startPos.copy();
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.force = 0;
  }

  show() {
    image(ballImg, this.pos.x, this.pos.y, ballSize, ballSize);
  }

  update() {
    const gravity = createVector(0, 0.2);
    this.acc.add(gravity);

    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc.mult(0);

    if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > width) {
      this.reset();
    }

    if (this.pos.y > prevPosY) {
      ballFalling = true;
    } else {
      ballFalling = false;
    }

    prevPosY = this.pos.y;
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

function mousePressed() {
  startDrag = createVector(mouseX, mouseY);
}

function mouseReleased() {
  if (
    ball.pos.x > 150 &&
    ball.pos.x < 400 &&
    ball.pos.y > 50 &&
    ball.pos.y < 750
  ) {
    const endDrag = createVector(mouseX, mouseY);
    const dragVector = p5.Vector.sub(endDrag, startDrag);
    ball.launch(dragVector);
    enteredBasket = false;
  }
}

function checkBasketEntry(minX, maxX) {
  if (!enteredBasket && ballFalling) {
    if (
      ball.pos.x + ballSize / 2 > minX &&
      ball.pos.x - ballSize / 2 < maxX &&
      ball.pos.y + ballSize / 2 > 180 &&
      ball.pos.y - ballSize / 2 < 280
    ) {
      score++;
      enteredBasket = true;
    }
  }
}
