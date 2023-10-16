let ball, post, basket;


function preload(){
    ball = loadImage('img/balon.png');
    post = loadImage('img/palo.png');
    basket = loadImage('img/aro.png');
}

function setup() {
    createCanvas(600, 658);
}
  
function draw() {
    background(220);

    image(post, 150, 50, 250, 700);
    image(basket, 230, 180, 100, 100);
    image(ball,230,520, 80, 80);
    
}

