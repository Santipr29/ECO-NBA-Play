let ballImg; //Cargar imagen
let startDrag;//Punto inicial del arrastre
let ballLaunched = false;

//Establecer la coneccion con el server
const socket = io.connect('http://localhost:5500', {path: '/real-time'});

//Probar las imagenes
function preload() {
    ballImg = loadImage('img/balon.png');
}

//Inicializador
function setup() {
    createCanvas(390, 844);
    ball = new Ball(138, 380);

    //Reseteo del balon a su punto de origen
    socket.on('ballDropped', () => {
        ball.reset();
        ballLaunched = false;
    });
}

//Pintar cosas en el canva
function draw() {
    background(220);
    ball.show();
    ball.update();
}

//Objeto del balon
class Ball {

    //Caracteristicas iniciales del balon
    constructor(x, y) {
      this.startPos = createVector(x, y);
      this.pos = this.startPos.copy();
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
    }

    //Mostrar el balon
    show() {
        image(ballImg, this.pos.x, this.pos.y, 120, 120); 
    }
  
    //Actualizar las caracteristicas del balon
    update() {
  
      this.vel.add(this.acc);
      this.pos.add(this.vel);
  
      this.acc.mult(0);

      if (this.pos.x < 0 || this.pos.x > width) {
        this.reset();
        ballLaunched = false;
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

//Punto inicial del arrastre
function touchStarted() {
    startDrag = createVector(mouseX, mouseY);
}

//Punto final del arrastre
function touchEnded() {
    const endDrag = createVector(mouseX, mouseY);
    const dragVector = p5.Vector.sub(endDrag, startDrag);
    ball.launch(dragVector);

    //Accion de lanzar el balon hacia el mupi
    socket.emit('launchBall', { x: dragVector.x, y: dragVector.y });
}