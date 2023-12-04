export class MupiMainScreen {
    constructor(p5, changeScreenCallback) {
      this.p5 = p5;
      this.changeScreen = changeScreenCallback;
  
      this.back;
      this.logo;
  
      this.socket = io.connect('https://41f4-2800-484-c3f-1e00-2d18-69d8-7ff0-b903.ngrok-free.app', { path: '/real-time' });
  
      // Cargar imágenes
      this.back2 = this.p5.loadImage('img/backfrontmupi.png');
      this.back = this.p5.loadImage('img/mupiback.png');
      this.logo = this.p5.loadImage('img/nbalogo.png');
      this.carga = this.p5.loadImage('img/carga.png');
    }

    setup(){
      this.p5.createCanvas(600, 658);
    }

    draw() {
      
      this.p5.background(220);
      this.p5.image(this.back,0,0, 600, 658)
      this.p5.image(this.back2, 0, 160, 600, 500);
      this.p5.image(this.logo, 200, 30);

      //Crear la notificacion de espera
      this.p5.rectMode(this.p5.CORNER)
      this.p5.fill(0, 0, 0, 150);
      this.p5.rect(0, 0, this.p5.width,this.p5.height);

      this.p5.fill(255, 255, 255)
      this.p5.rect(165,182,271,294,24)
      this.p5.image(this.carga,259,225)
      
      this.p5.textStyle(this.p5.BOLD);
      this.p5.textSize(18);
      this.p5.fill('#D71E54')
      this.p5.text('Please wait while',228,380);
      this.p5.textStyle(this.p5.BOLD);
      this.p5.textSize(18);
      this.p5.fill('#D71E54');
      this.p5.text('we connect your devices',194,410);
      

    }
}