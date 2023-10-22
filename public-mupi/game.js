let ballImg, post, basket,basketTop, back;
let startDrag;
let score = 0;
let ballFalling = false;
let enteredBasket = false;
let ballLaunched = false;
let ballSize = 50; 
let prevPosY = 0;

const topAreaY = 180;
const bottomAreaY = 180;

const socket = io.connect('http://localhost:5500', {path: '/real-time'});

function preload() {
  ballImg = loadImage('img/balon.png');
  post = loadImage('img/palo.png');
  basket = loadImage('img/aro.png');
  basketTop= loadImage('img/arotop.png');
  back= loadImage('img/back.png');
}

function setup() {
  createCanvas(600, 658);
  ball = new Ball(251, 620);

  socket.on('ballLaunched', (data) => {
    console.log(data);
    ball.pos = createVector(width / 2, height);  
    const vector = createVector(data.x, data.y);
    ball.launch(vector);
    ballLaunched = true;  
});
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
  let minY = topAreaY;
  let maxY = bottomAreaY;

  textSize(24);
  fill(0);
  text("Puntos: " + score, 10, 30);

  if (ballLaunched) {
    ball.show();
    ball.update();
  }

  markPoint(minX, maxX, minY, maxY);  
  handleBasketCollision(minX, maxX, minY, maxY); 
  if (enteredBasket) {
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
      push(); 
      translate(this.pos.x, this.pos.y);
    
      let scaleFactor = 1.0; 
    
      if (ballFalling) {
        scaleFactor = map(this.vel.y, 0, -9, 1.0, 1.0 ); 
      } else {
        scaleFactor = map(this.vel.y, 0, 9, 1.0, 0.5); 
      }
    
      scale(scaleFactor); 
    
      image(ballImg, 0, 0, ballSize, ballSize);
    
      pop(); 
    }

  update() {
    const gravity = createVector(0, 0.2);
    this.acc.add(gravity);

    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc.mult(0);

    if (this.pos.y > prevPosY) {
      ballFalling = true;
    } else {
      ballFalling = false;
    }

    prevPosY = this.pos.y;

    if (this.pos.x < -400 || this.pos.x > width + 400 || this.pos.y < -250 || this.pos.y > width + 300) {
      this.reset();
      ballLaunched = false;
      socket.emit('ballDropped'); 
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

function handleBasketCollision(minX, maxX, minY, maxY) {
  if (ballFalling) {
    if (
      (ball.pos.x - ballSize / 2 <= maxX && ball.pos.x + ballSize / 2 >= minX) &&
      (ball.pos.y + ballSize / 2 >= minY)
    ) {
      const middleX = (minX + maxX) / 2;
      if (ball.pos.x < middleX - ballSize / 2 || ball.pos.x > middleX + ballSize / 2) {
        ball.vel.y *= -1;  
      }
    }
  }
}

function markPoint(minX, maxX, minY, maxY) {
  if (!enteredBasket && ballFalling) {
    const middleX = (minX + maxX) / 2;

    if (
      ball.pos.x >= middleX - ballSize / 2 &&
      ball.pos.x <= middleX + ballSize / 2
    ) {
      if (
        ball.pos.y + ballSize / 2 >= minY &&
        ball.pos.y - ballSize / 2 <= maxY
      ) {
        enteredBasket = true;  
        score++;  
      }
    }
  }
}
  