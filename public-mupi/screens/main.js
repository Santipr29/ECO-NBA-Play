export class MupiMaincreen {
    constructor(p5) {
        this.p5 = p5;
    
        this.back;
        this.logo;
    
        this.socket = io.connect('http://localhost:5500', { path: '/real-time' });
    
        // Cargar imágenes
        this.back = this.p5.loadImage('img/mupiback.png');
        this.logo = this.p5.loadImage('img/nbalogo.png')
      }

      setup(){
        this.p5.createCanvas(600, 658);
      }

      draw() {
        this.p5.background(220);
        this.p5.image(this.back,0,0, 600, 658)
        this.p5.image(this.logo, 200, 30);
      }
}