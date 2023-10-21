let ball;
let startDrag;
let socket;

function setup() {
    createCanvas(windowWidth, windowHeight);
    ball = new Ball(width/2, height/2);

    socket = io.connect('http://localhost:5500/controller');
}

function draw() {
    background(220);
    ball.show();
    ball.update();
}

function touchStarted() {
    startDrag = createVector(touches[0].x, touches[0].y);
    return false; 
}

function touchEnded() {
    if (touches.length == 0) { 
        const endDrag = createVector(touches[0].x, touches[0].y);
        const dragVector = p5.Vector.sub(endDrag, startDrag);
        ball.launch(dragVector);
        socket.emit('launchBall', { x: dragVector.x, y: dragVector.y });
    }
    return false; 
}

