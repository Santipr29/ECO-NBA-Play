// Clase para la pantalla del juego en el mupi
export class MupiGameScreen {
  constructor(p5) {
    this.p5 = p5;
    this.ball;
    this.score = 0;
    this.ballFalling = false;
    this.enteredBasket = false;
    this.ballLaunched = false;
    this.gameStarted = false;
    this.isGameOver = false;
    this.ballSize = 50;
    this.prevPosY = 0;
    this.topAreaY = 180;
    this.bottomAreaY = 180;
    this.basketX = 250;
    this.basketSpeed = 0;
    this.basketDir = 1;
    this.timeLeft = 60;
    this.startTime = 5;

    this.ballImg;
    this.post;
    this.basket;
    this.basketTop;
    this.back;

    this.socket = io.connect('http://localhost:5500', { path: '/real-time' });

    // Cargar imágenes
    this.ballImg = this.p5.loadImage('img/balon.png');
    this.post = this.p5.loadImage('img/palo.png');
    this.basket = this.p5.loadImage('img/aro.png');
    this.basketTop = this.p5.loadImage('img/arotop.png');
    this.back = this.p5.loadImage('img/back.png');
  }
  
// Inicializador
setup() {
  // Crear el objeto de la pelota
  this.p5.createCanvas(600, 658);
  this.ball = new Ball(251, 620, this);

  // Inicio del juego
  let startInterval = setInterval(() => {
    this.startTime--;
    if (this.startTime <= 0) {
      clearInterval(startInterval);
      this.gameStarted = true;
    }
  }, 1000);

  // Contador de juego
  setInterval(() => {
    if (this.gameStarted) {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.gameOver();
      }
    }
  }, 1000);

  // Lanzamiento de la pelota
  this.socket.on('ballLaunched', (data) => {
    this.ball.pos = this.p5.createVector(this.p5.width / 2, this.p5.height);
    const vector = this.p5.createVector(data.x, data.y);
    this.ball.launch(vector);
    this.ballLaunched = true;
  });
}

  // Pintar cosas en el canvas
  draw() {
    this.p5.background(220);

    // Pintar los niveles
    if (this.score >= 10 && this.basketSpeed === 0) {
      this.basketSpeed = 2;
    } else if (this.score >= 20 && this.basketSpeed === 2) {
      this.basketSpeed = 4;
    } else if (this.score >= 35 && this.basketSpeed === 4) {
      this.basketSpeed = 6;
    }

    this.basketX += this.basketSpeed * this.basketDir;

    // Rebote del nivel
    if (this.basketX <= 0 || this.basketX >= this.p5.width - 100) {
      this.basketDir *= -1;
    }

    // Pintar de inicio
    this.p5.image(this.back, 0, 0);
    this.p5.image(this.post, this.basketX - 80, 50, 250, 700);
    this.p5.image(this.basket, this.basketX, 180, 100, 100);

    // Áreas del aro para contar los puntos
    let minX = this.basketX;
    let maxX = this.basketX + 50;
    let minY = this.topAreaY;
    let maxY = this.bottomAreaY;

    // Pintar el contador de inicio de juego
    if (!this.gameStarted && this.timeLeft > 0) {
      this.p5.fill(0, 0, 0, 150);
      this.p5.rect(0, 0, this.p5.width, this.p5.height);

      this.p5.fill(255, 255, 255);
      this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
      this.p5.textSize(32);
      this.p5.text(
        'Comenzando en: ' + this.startTime,
        this.p5.width / 2,
        this.p5.height / 2 + 20
      );

      this.p5.textAlign(this.p5.LEFT, this.p5.BASELINE);
    }

    // Puntaje
    this.p5.textSize(24);
    this.p5.fill(0);
    this.p5.text('Puntos: ' + this.score, 10, 30);

    // Contador
    this.p5.text('Tiempo: ' + this.timeLeft, this.p5.width - 120, 30);

    // Pintar la pelota con sus movimientos
    if (this.ballLaunched) {
      this.ball.show();
      this.ball.update();
    }

    // Contar Puntos
    this.markPoint(minX, maxX, minY, maxY);

    // Contar rebotes del balón con el aro
    this.handleBasketCollision(minX, maxX, minY, maxY);

    // Efecto Visual del balón entrando al aro
    if (this.enteredBasket) {
      this.p5.image(this.basketTop, this.basketX, 180, 100, 100);
    }

    // Pintar puntuación final
    if (this.isGameOver) {
      this.p5.fill(0, 0, 0, 150);
      this.p5.rect(0, 0, this.p5.width, this.p5.height);

      this.p5.fill(255, 255, 255);
      this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
      this.p5.text(
        'Tu puntaje fue: ' + this.score,
        this.p5.width / 2,
        this.p5.height / 2 + 20
      );

      this.p5.textAlign(this.p5.LEFT, this.p5.BASELINE);
    }
  }

  // Finalizar el juego
  gameOver() {
    this.gameStarted = false;
    this.isGameOver = true;
  }

  // Rebotes en el aro
  handleBasketCollision(minX, maxX, minY, maxY) {
    if (this.ballFalling) {
      if (
        this.ball.pos.x - this.ballSize / 2 <= maxX &&
        this.ball.pos.x + this.ballSize / 2 >= minX &&
        this.ball.pos.y + this.ballSize / 2 >= minY
      ) {
        const middleX = (minX + maxX) / 2;
        if (
          this.ball.pos.x < middleX - this.ballSize / 2 ||
          this.ball.pos.x > middleX + this.ballSize / 2
        ) {
          this.ball.vel.y *= -1;
        }
      }
    }
  }

  // Contar los puntos
  markPoint(minX, maxX, minY, maxY) {
    if (!this.enteredBasket && this.ballFalling) {
      const middleX = (minX + maxX) / 2;

      if (
        this.ball.pos.x >= middleX - this.ballSize / 2 &&
        this.ball.pos.x <= middleX + this.ballSize / 2 &&
        this.ball.pos.y + this.ballSize / 2 >= minY &&
        this.ball.pos.y - this.ballSize / 2 <= maxY
      ) {
        this.enteredBasket = true;
        this.score++;

        this.socket.emit('mensaje', this.enteredBasket);
      }
    }
  }
}

// Objeto del balón
class Ball {
  constructor(x, y, parent) {
    this.parent = parent;
    this.pos = this.parent.p5.createVector(x, y);
    this.vel = this.parent.p5.createVector(0, 0);
    this.acc = this.parent.p5.createVector(0, 0);
    this.force = 0;
  }

  // Mostrar el balón
  show() {
    this.parent.p5.push();
    this.parent.p5.translate(this.pos.x, this.pos.y);

    // Escalar las dimensiones del balón en subida y bajada
    let scaleFactor = 1.0;

    if (this.parent.ballFalling) {
      scaleFactor = this.parent.p5.map(
        this.vel.y,
        0,
        -9,
        1.0,
        1.0
      );
    } else {
      scaleFactor = this.parent.p5.map(
        this.vel.y,
        0,
        9,
        1.0,
        0.5
      );
    }

    this.parent.p5.scale(scaleFactor);

    this.parent.p5.image(
      this.parent.ballImg,
      0,
      0,
      this.parent.ballSize,
      this.parent.ballSize
    );

    this.parent.p5.pop();
  }

  // Actualizar las características del balón
  update() {
    const gravity = this.parent.p5.createVector(0, 0.2);
    this.acc.add(gravity);

    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc.mult(0);

    // Confirmar si el balón está subiendo o bajando
    if (this.pos.y > this.parent.prevPosY) {
      this.parent.ballFalling = true;
    } else {
      this.parent.ballFalling = false;
    }

    this.parent.prevPosY = this.pos.y;

    // Resetear el balón en el celular
    if (
      this.pos.x < -400 ||
      this.pos.x > this.parent.p5.width + 400 ||
      this.pos.y < -250 ||
      this.pos.y > this.parent.p5.width + 300
    ) {
      this.reset();
      this.parent.ballLaunched = false;
      this.parent.socket.emit('ballDropped');
    }
  }

  // Volver el balón a sus propiedades originales
  reset() {
    this.pos = this.pos.copy();
    this.vel.mult(0);
    this.acc.mult(0);
  }

  // Vector de lanzamiento del balón
  launch(direction) {
    const dir = direction.copy().normalize();

    this.vel = dir.mult(direction.mag() * 0.1);

    this.acc.mult(0);
  }
}
