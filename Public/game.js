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
        this.pos = createVector(x,y)
        this.vel = createVector(0,0)
    }

    show(){
        image(ballImg, this.pos.x , this.pos.y, 80, 80);
    }

    update(){
        this.pos.add(this.vel);
    }

    launch(direction){
        const dir = direction.copy().normalize();

        this.vel = dir.mult(direction.mag()*0.1)
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