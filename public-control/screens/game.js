export class CellPhoneGameScreen {
    constructor(p5) {
      this.p5 = p5;
      this.ballImg = null;
      this.back = null;
      this.ball = null;
      this.startDrag = null;
      this.ballLaunched = false;
  
      // Establecer la conexión con el servidor
      this.socket = io.connect('http://localhost:5500', { path: '/real-time' });
  
      // Cargar imágenes
      this.ballImg = this.p5.loadImage('img/balon.png');
      this.back = this.p5.loadImage('img/celular.jpeg');
      
      // Inicializar el canvas y el objeto del balón
      this.setup();
    }
  
    setup() {
      this.p5.createCanvas(390, 844);
      this.ball = new Ball(138, 380, this.p5);
  
      // Reseteo del balón a su punto de origen
      this.socket.on('ballDropped', () => {
        this.ball.reset();
        this.ballLaunched = false;
      });
    }
  
    draw() {
      this.p5.background(220);
      this.p5.image(this.back, 0, 0);
      this.ball.show();
      this.ball.update();
    }
  
    touchStarted() {
      this.startDrag = this.p5.createVector(this.p5.mouseX, this.p5.mouseY);
    }
  
    touchEnded() {
      const endDrag = this.p5.createVector(this.p5.mouseX, this.p5.mouseY);
      const dragVector = this.p5.createVector(endDrag.x - this.startDrag.x, endDrag.y - this.startDrag.y);
      this.ball.launch(dragVector);
  
      // Acción de lanzar el balón hacia el mupi
      this.socket.emit('launchBall', { x: dragVector.x, y: dragVector.y });
    }
  }
  
  class Ball {
    constructor(x, y, p5) {
      this.startPos = p5.createVector(x, y);
      this.pos = this.startPos.copy();
      this.vel = p5.createVector(0, 0);
      this.acc = p5.createVector(0, 0);
      this.p5 = p5;
      this.ballImg = this.p5.loadImage('img/balon.png');
    }
  
    show() {
      this.p5.image(this.ballImg, this.pos.x, this.pos.y, 120, 120);
    }
  
    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
  
      if (this.pos.x < 0 || this.pos.x > this.p5.width) {
        this.reset();
        this.ballLaunched = false;
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