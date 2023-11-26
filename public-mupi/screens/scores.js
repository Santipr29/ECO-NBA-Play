export class MupiScoreScreen {
    constructor(p5) {
        this.p5 = p5;
    
        this.background;
        this.cards;

        this.top1img;
        this.top2img;
        this.top3img;

        this.top1name;
        this.top2name;
        this.top3name;
        this.top4name;
        this.top5name;
        this.top6name;
        this.top7name;
        this.top8name;
        this.top9name;

        this.top1score;
        this.top2score;
        this.top3score;
        this.top4score;
        this.top5score;
        this.top6score;
        this.top7score;
        this.top8score;
        this.top9score;

        this.startTime = 10;

        this.socket = io.connect('http://localhost:5500', { path: '/real-time' });
        this.background = this.p5.loadImage('img/topbackground.png');
        this.cards = this.p5.loadImage('img/cards.png');
      }

      setup(){
        this.p5.createCanvas(600, 658);
        // let startInterval = setInterval(() => {
        //   this.startTime--;
        //   if (this.startTime <= 0) {
        //     clearInterval(startInterval);
        //     this.socket.emit('restart')
        //   }
        // }, 1000);

        // Solicitar la lista de usuarios ordenada al conectarse
        this.socket.emit('requestUsers');

        // Escuchar el evento 'sendUsers'
        this.socket.on('sendUsers', (users) => {
            // Actualizar la pantalla con la nueva información de usuarios
            console.log('Users received:', users);
            this.top1img = this.p5.loadImage(users[0].img);
            this.top2img = this.p5.loadImage(users[1].img);
            this.top3img = this.p5.loadImage(users[2].img);
            
            this.top1name = `${users[0].first} ${users[0].last}`;
            this.top2name = `${users[1].first} ${users[1].last}`;
            this.top3name = `${users[2].first} ${users[2].last}`;
            this.top4name = `${users[3].first} ${users[3].last}`;
            this.top5name = `${users[4].first} ${users[4].last}`;
            this.top6name = `${users[5].first} ${users[5].last}`;
            this.top7name = `${users[6].first} ${users[6].last}`;
            this.top8name = `${users[7].first} ${users[7].last}`;
            this.top9name = `${users[8].first} ${users[8].last}`;

            this.top1score = users[0].score
            this.top2score = users[1].score
            this.top3score = users[2].score
            this.top4score = users[3].score
            this.top5score = users[4].score
            this.top6score = users[5].score
            this.top7score = users[6].score
            this.top8score = users[7].score
            this.top9score = users[8].score

        });

      }

      draw() {
        this.p5.background(230);
        this.p5.image(this.background,0,0)
        this.p5.image(this.cards, 10,350)

        if (this.top1img) {
          this.p5.image(this.top1img, 0, 0);
        }

        if (this.top2img) {
          this.p5.image(this.top2img, 50, 0);
        }

        if (this.top3img) {
          this.p5.image(this.top3img, 100, 0);
        }

        this.p5.textSize(32);
        this.p5.textStyle(this.p5.BOLD)
        this.p5.fill('#FFFFFF');
        this.p5.text("Leaderboard ", 100, 50);

        this.p5.textSize(14);
        this.p5.textStyle(this.p5.NORMAL)
        this.p5.fill('#FFFFFF');
        this.p5.text("Garden Stadium", 100, 100);
        this.p5.text("2", 100, 150);
        this.p5.text("3", 300, 150);
        this.p5.text(this.top1name, 55, 300);
        this.p5.text(this.top2name, 248, 300);
        this.p5.text(this.top3name, 38, 400);

        this.p5.fill('#2A3041');
        this.p5.text(this.top4name, 52, 500);
        this.p5.text(this.top5name, 45, 600);
        this.p5.text(this.top6name, 45, 600);
        this.p5.text(this.top7name, 45, 600);
        this.p5.text(this.top8name, 45, 600);
        this.p5.text(this.top9name, 45, 600);

        this.p5.textStyle(this.p5.BOLD)
        this.p5.fill('#FFFFFF');
        this.p5.text(this.top1score, 55, 300);
        this.p5.text(this.top2score, 248, 300);
        this.p5.text(this.top3score, 38, 400);

        this.p5.fill('#2A3041');
        this.p5.text(this.top4score, 52, 500);
        this.p5.text(this.top5score, 45, 600);
        this.p5.text(this.top6score, 45, 600);
        this.p5.text(this.top7score, 45, 600);
        this.p5.text(this.top8score, 45, 600);
        this.p5.text(this.top9score, 45, 600);

      }
}