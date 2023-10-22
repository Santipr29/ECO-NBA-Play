let ballImg, post, basket,basketTop, back; //Cargar imagenes
let score = 0;

//Estados
let ballFalling = false;
let enteredBasket = false;
let ballLaunched = false;
let gameStarted = false;
let isGameOver = false;

let ballSize = 50; 
let prevPosY = 0;
const topAreaY = 180;
const bottomAreaY = 180;

//Niveles
let basketX = 230;
let basketSpeed = 0;
let basketDir = 1;

//Contadores
let timeLeft = 60; // Tiempo en segundos.
let startTime = 5; // Tiempo en segundos antes de que comience el juego

const socket = io.connect('http://localhost:5500', {path: '/real-time'});

//Probar las imagenes
function preload() {
  ballImg = loadImage('img/balon.png');
  post = loadImage('img/palo.png');
  basket = loadImage('img/aro.png');
  basketTop= loadImage('img/arotop.png');
  back= loadImage('img/back.png');
}

//Inicializador
function setup() {
  createCanvas(600, 658);
  ball = new Ball(251, 620);

  //Inicio del juego
  let startInterval = setInterval(function() {
    startTime--;
    if (startTime <= 0) {
        clearInterval(startInterval);
        gameStarted = true;
    }
  }, 1000);

  //Contador Juego
  setInterval(function() {
    if(gameStarted) {
        timeLeft--;
        if (timeLeft <= 0) {
            gameOver();
        }
    }
  }, 1000);

  //Lanzamiento de la pelota
  socket.on('ballLaunched', (data) => {
    ball.pos = createVector(width / 2, height);  
    const vector = createVector(data.x, data.y);
    ball.launch(vector);
    ballLaunched = true;  
});
}


//Pintar cosas en el canva
function draw() {
  background(220);

  //Pintar los niveles
  if(score >= 10 && basketSpeed == 0){
    basketSpeed = 2;
  }else if(score >= 20 && basketSpeed == 2){
    basketSpeed = 4;
  }else if(score >= 35 && basketSpeed == 4){
    basketSpeed = 6;
  }

  basketX += basketSpeed * basketDir;

  //Rebote del nivel
  if(basketX <= 0 || basketX >= width - 100){
    basketDir *= -1;
  }

  //Pintar de inicio
  image(back, 0, 0);
  image(post, basketX - 80, 50, 250, 700);
  image(basket, basketX, 180, 100, 100);

  //Areas del aro para contar los puntos
  let minX = basketX; 
  let maxX = basketX + 50; 
  let minY = topAreaY;
  let maxY = bottomAreaY;

  //Pintar el contador de inicio de juego
  if (!gameStarted && timeLeft > 0) {
    fill(0, 0, 0, 150); 
    rect(0, 0, width, height);

    fill(255, 255, 255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Comenzando en: " + startTime, width / 2, height / 2 + 20);

    textAlign(LEFT, BASELINE);
  }

  //Puntaje
  textSize(24);
  fill(0);
  text("Puntos: " + score, 10, 30);

  //Contador
  text("Tiempo: " + timeLeft, width - 120, 30);

  //Pintar la pelota con sus movimientos
  if (ballLaunched) {
    ball.show();
    ball.update();
  }

  //Contar Puntos
  markPoint(minX, maxX, minY, maxY);  

  //Contar rebotes del balon con el aro
  handleBasketCollision(minX, maxX, minY, maxY); 

  //Efecto Visual del balon entrando al aro
  if (enteredBasket) {
    image(basketTop, basketX, 180, 100, 100);
  }

  //Pintar puntuacion final
  if (isGameOver) {
    fill(0, 0, 0, 150); 
    rect(0, 0, width, height);

    fill(255, 255, 255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Tu puntaje fue: " + score, width / 2, height / 2 + 20);

    textAlign(LEFT, BASELINE);
}
}

//Objeto del balon
class Ball {

  //Caracteristicas iniciales del balon
  constructor(x, y) {
    this.startPos = createVector(x, y);
    this.pos = this.startPos.copy();
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.force = 0;
  }

  //Mostrar el balon
  show() {
      push(); 
      translate(this.pos.x, this.pos.y);

      //Escalar las dimensiones del balon en subida y bajada
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

  //Actualizar las caracteristicas del balon
  update() {
    const gravity = createVector(0, 0.2);
    this.acc.add(gravity);

    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc.mult(0);

    //Confirmar si el balon esta subiendo o bajando
    if (this.pos.y > prevPosY) {
      ballFalling = true;
    } else {
      ballFalling = false;
    }

    prevPosY = this.pos.y;

    //Resetear el balon en el celular
    if (this.pos.x < -400 || this.pos.x > width + 400 || this.pos.y < -250 || this.pos.y > width + 300) {
      this.reset();
      ballLaunched = false;
      socket.emit('ballDropped'); 
    }
  }

  //Volver el balon a sus propiedades originales
  reset() {
    this.pos = this.startPos.copy();
    this.vel.mult(0);
    this.acc.mult(0);
  }

  //Vector de lanzamiento del balon
  launch(direction) {
    const dir = direction.copy().normalize();

    this.vel = dir.mult(direction.mag() * 0.1);

    this.acc.mult(0);
  }
  
}

//Finalizar el juego
function gameOver() {
  gameStarted = false;
  isGameOver = true;
}

//Rebotes en el aro
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


//Contar los puntos
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
  