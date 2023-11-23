export class MupiScoreScreen {
    constructor(p5) {
        this.p5 = p5;
    
        this.back1;
        this.back2;
        this.logo;
        this.qr;
        this.startTime = 10;

        this.socket = io.connect('http://localhost:5500', { path: '/real-time' });
    
        // Cargar imágenes
        this.back1 = this.p5.loadImage('img/mupiback.png');
        this.back2 = this.p5.loadImage('img/backfrontmupi.png');
        this.logo = this.p5.loadImage('img/nbalogo.png')
      }

      setup(){
        this.p5.createCanvas(600, 658);
        let startInterval = setInterval(() => {
          this.startTime--;
          if (this.startTime <= 0) {
            clearInterval(startInterval);
            this.socket.emit('restart')
          }
        }, 1000);

        // Solicitar la lista de usuarios ordenada al conectarse
        this.socket.emit('requestUsers');

        // Escuchar el evento 'sendUsers'
        this.socket.on('sendUsers', (users) => {
            // Actualizar la pantalla con la nueva información de usuarios
            console.log('Users received:', users);
            // Realiza las acciones necesarias para mostrar la información en la pantalla
        });

      }

      draw() {
        this.p5.background(220);
        this.p5.image(this.back1,0,0, 600, 658)
        this.p5.image(this.back2, 0, 160, 600, 500);
        this.p5.image(this.logo, 200, 30);
        //this.p5.image(this.qr, 0, 0);
      }
}