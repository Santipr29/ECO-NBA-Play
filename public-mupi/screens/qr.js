export class MupiQRScreen {
      constructor(p5, changeScreenCallback) {
        this.p5 = p5;
        this.changeScreen = changeScreenCallback;
    
        this.back1;
        this.back2;
        this.logo;
        this.qr;
    
        this.socket = io.connect('https://41f4-2800-484-c3f-1e00-2d18-69d8-7ff0-b903.ngrok-free.app', { path: '/real-time' });
    
        // Cargar imágenes
        this.back1 = this.p5.loadImage('img/mupiback.png');
        this.back2 = this.p5.loadImage('img/backfrontmupi.png');
        this.logo = this.p5.loadImage('img/nbalogo.png')
        this.qr = this.p5.loadImage('img/qr.png')
      }

      setup(){
        this.p5.createCanvas(600, 658);
      }

      draw() {
        this.p5.background(220);
        this.p5.image(this.back1,0,0, 600, 658)
        this.p5.image(this.back2, 0, 160, 600, 500);
        this.p5.image(this.logo, 200, 30);
        this.p5.image(this.qr, 210, 200, 200, 200);
      }
}