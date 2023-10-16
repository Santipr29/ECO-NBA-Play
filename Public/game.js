let ballImg, post, basket;

let startDrag;

function preload(){
    ballImg = loadImage('img/balon.png');
    post = loadImage('img/palo.png');
    basket = loadImage('img/aro.png');
}

function setup() {
    createCanvas(600, 658);
    ball = new Ball(230,520);
}
  
function draw() {
    background(220);

    image(post, 150, 50, 250, 700);
    image(basket, 230, 180, 100, 100);

    ball.show();
    ball.update();
}

class Ball{
    constructor(x,y){
        this.startPos = createVector(x,y);
        this.pos = this.startPos.copy();

        //this.pos = createVector(x,y);
        this.vel = createVector(0,0);
        this.acc = createVector(0,0);
        this.force = 0;
    }

    show(){
        image(ballImg, this.pos.x , this.pos.y, 80, 80);
    }

    update(){
        const gravity = createVector(0, 0.2);
        this.acc.add(gravity);

        this.vel.add(this.acc);
        this.pos.add(this.vel);

        this.acc.mult(0);

        if(this.pos.x < 0 || this.pos.x > width || this.pos.y < 0){
            this.reset();
        }
    }

    reset(){
        this.pos = this.startPos.copy();
        this.vel.mult(0);
        this.acc.mult(0);
    }

    launch(direction){
        const dir = direction.copy().normalize();

        this.vel = dir.mult(direction.mag()*0.1)

        this.acc.mult(0)
    }
}

function mousePressed(){
    startDrag = createVector(mouseX, mouseY);
}

function mouseReleased(){
    const endDrag = createVector(mouseX, mouseY);
    const dragVector = p5.Vector.sub(endDrag, startDrag);
    ball.launch(dragVector)
}