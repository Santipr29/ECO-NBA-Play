let ballImg, post, basket,basketTop, back;
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
  basketTop= loadImage('img/arotop.png');
  back= loadImage('img/back.png');
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
  image(back, 0, 0);
  image(post, basketX - 80, 50, 250, 700);
  image(basket, basketX, 180, 100, 100);

  let minX = basketX; 
  let maxX = basketX + 50; 
  let minY = 150;
  let maxY = 150;

  textSize(24);
  fill(0);
  text("Puntos: " + score, 10, 30);

  ball.show();
  ball.update();
  checkBasketEntry(minX, maxX, minY, maxY);
  
  if(enteredBasket){
    image(basketTop, basketX, 180, 100, 100);
  }
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

    if (this.pos.x < -400 || this.pos.x > width + 400 || this.pos.y < -250 || this.pos.y > width) {
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

  show() {
    push(); // Guarda la configuración de la matriz de transformación actual
    translate(this.pos.x, this.pos.y);
  
    let scaleFactor = 1.0; // Factor de escala inicial
  
    if (ballFalling) {
      scaleFactor = map(this.vel.y, 0, -9, 1.0, 1.0 ); // Disminuye la escala cuando la pelota baja
    } else {
      scaleFactor = map(this.vel.y, 0, 9, 1.0, 0.5); // Aumenta la escala cuando la pelota sube
    }
  
    scale(scaleFactor); // Aplica la escala
  
    image(ballImg, 0, 0, ballSize, ballSize);
  
    pop(); // Restaura la matriz de transformación
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

function checkBasketEntry(minX, maxX, minY, maxY) {
    if (!enteredBasket && ballFalling) {
      if (
        ball.pos.x + ballSize / 2 > minX &&
        ball.pos.x - ballSize / 2 < maxX &&
        ball.pos.y + ballSize / 2 > minY &&       
        ball.pos.y - ballSize / 2 < maxY          
      ) {
        score++;
        enteredBasket = true;
      }
    }
  }
 
  