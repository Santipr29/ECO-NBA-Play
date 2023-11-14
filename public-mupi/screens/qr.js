export class MupiQRScreen {
    constructor(p5) {
        this.p5 = p5;
    
        this.back1;
        this.back2;
        this.logo;
        this.qr;
    
        this.socket = io.connect('http://localhost:5500', { path: '/real-time' });
    
        // Cargar imágenes
        this.back1 = this.p5.loadImage('img/mupiback.png');
        this.back2 = this.p5.loadImage('img/backfrontmupi.png');
        this.logo = this.p5.loadImage('img/nbalogo.png')
      }

      setup(){
        this.p5.createCanvas(600, 658);
      }

      draw() {
        this.p5.background(220);
        this.p5.image(this.back1,0,0, 600, 658)
        this.p5.image(this.back2, 0, 160, 600, 500);
        this.p5.image(this.logo, 200, 30);
        //this.p5.image(this.qr, 0, 0);
      }
}