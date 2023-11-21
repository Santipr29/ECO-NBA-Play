export class CellPhoneMainScreen {
    constructor(p5, changeScreen) {
      this.p5 = p5;
  
      this.back;
      this.logo;
      this.players;

      this.logIn = p5.createButton('Log In').position(20, 270).size(350, 50);
      this.logIn.style('background-color', '#006AB7').style('border-radius', '10px').style('border', '2px solid #0F62FE').style('font-size', '16px').style('color', 'white').style('font-weight', 'bold');
      this.signUp = p5.createButton('Sign Up').position(20, 340).size(350, 50);
      this.signUp.style('background-color', '#D71E54').style('border-radius', '10px').style('border', '2px solid #F43F74').style('font-size', '16px').style('color', 'white').style('font-weight', 'bold');
  
      this.socket = io.connect('http://localhost:5500', { path: '/real-time' });
  
      // Cargar imágenes
      this.back = this.p5.loadImage('img/backcel.png');
      this.logo = this.p5.loadImage('img/logocel.png');
      this.players = this.p5.loadImage('img/mainimg2.png');
      
      this.logIn.mousePressed(() => {
          this.socket.emit('logIn')
      });

      this.signUp.mousePressed(() => {
          this.socket.emit('signUp')
      });

      this.changeScreen = changeScreen;
      this.setup();
    }

    setup(){
      this.p5.createCanvas(390, 844);
    }

    clear(){
      this.logIn.hide();
      this.signUp.hide();
    }

    draw() {
      this.p5.background(220);
      this.p5.image(this.back,0,0);
      this.p5.image(this.logo, 90, 30);
      this.p5.image(this.players, 0,420);
    }
}