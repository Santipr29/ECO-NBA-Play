export class CellPhoneMainScreen {
    constructor(p5) {
        this.p5 = p5;
    
        this.back;
        this.logo;
        this.players;
    
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
        this.p5.image(this.back,0,0)
        this.p5.image(this.logo, 90, 30);
        this.p5.image(this.players, 0,350)
      }
}