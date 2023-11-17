export class CellPhoneMainScreen {
    constructor(p5) {
        this.p5 = p5;
    
        this.back;
        this.logo;
        this.players;

        this.logIn = new Button(p5, 'Log In', 'red', 20, 270, 350, 50);
        this.signUp = new Button(p5, 'Sign Up', 'blue', 20, 340, 350, 50);
    
        this.socket = io.connect('http://localhost:5500', { path: '/real-time' });
    
        // Cargar imágenes
        this.back = this.p5.loadImage('img/backcel.png');
        this.logo = this.p5.loadImage('img/logocel.png');
        this.players = this.p5.loadImage('img/mainimg2.png');
        
      }

      setup(){
        this.p5.createCanvas(390, 844);
      }

      draw() {
        this.p5.background(220);
        this.p5.image(this.back,0,0);
        this.p5.image(this.logo, 90, 30);
        this.p5.image(this.players, 0,420);
        this.logIn.draw();
        this.signUp.draw();
      }

      mouseClicked() {
        if (this.logIn.isMouseOver()) {
          console.log('Log In clicked!');
        } else if (this.signUp.isMouseOver()) {
          console.log('Sign Up clicked!');
        }
      }
}

class Button {
  constructor(p5, label, color, x, y, width, height) {
    this.p5 = p5;
    this.label = label;
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    this.p5.fill(this.color);
    this.p5.rect(this.x, this.y, this.width, this.height);
    this.p5.fill(255);
    this.p5.textSize(18);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.text(this.label, this.x + this.width / 2, this.y + this.height / 2);
  }

  isMouseOver() {
    return (
      this.p5.mouseX > this.x &&
      this.p5.mouseX < this.x + this.width &&
      this.p5.mouseY > this.y &&
      this.p5.mouseY < this.y + this.height
    );
  }
}