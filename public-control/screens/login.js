export class CellPhoneLogInScreen {
  constructor(p5, changeScreen) {
      this.p5 = p5;
  
      this.back;
      this.logo;
      this.errorimg;
      this.error = false;
  
      this.socket = io.connect('https://41f4-2800-484-c3f-1e00-2d18-69d8-7ff0-b903.ngrok-free.app', { path: '/real-time' });
  
      // Crear campos de entrada y botón usando createInput y createButton
      this.emailInput = p5.createInput().position(24, 350).size(332, 30).attribute('type', 'email');
      this.emailInput.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');

      this.passwordInput = p5.createInput().position(24, 460).size(332, 30).attribute('type', 'password');
      this.passwordInput.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');

      //Crear botones para enviar informacion del Log In o cambiar de pantalla para el Sign Up
      this.logInButton = p5.createButton('Log In').position(20, 580).size(350, 40);
      this.logInButton.style('background-color', '#006AB7').style('border-radius', '10px').style('border', '2px solid #0F62FE').style('font-size', '16px').style('color', 'white').style('font-weight', 'bold');

      this.account = p5.createButton('No account yet? Sign Up').position(19, 720);
      this.account.style('background-color', 'transparent').style('border', '1px solid transparent').style('font-size', '14px').style('color', '#001D6C').style('font-weight', 'regular');

      // Cargar imágenes
      this.back = this.p5.loadImage('img/backcel.png');
      this.logo = this.p5.loadImage('img/logocel.png');
      this.errorimg = this.p5.loadImage('img/error.png');

      //Darle click a los botones
      this.logInButton.touchStarted(() => {
        //Tomar valores de los inputs
        const email = this.emailInput.value();
        const password = this.passwordInput.value();

        //Enviar los valores de los inputs al server
        this.socket.emit('logInData', {email: email, password: password})
      });

      this.account.touchStarted(() => {
        //Cambiar de pantalla a Sign Up
        this.socket.emit('signUp')
      });

      this.changeScreen = changeScreen;
      this.setup();
  }

  setup() {
      this.p5.createCanvas(390, 844);
      
      this.socket.on('error', () => {
        this.error = true
        setTimeout(() => {
          this.error = false;
          this.emailInput.show();
          this.passwordInput.show();
          this.logInButton.show();
      }, 5000);
      });
  }

  //Eliminar elementos html
  clear(){
    this.emailInput.hide();
    this.passwordInput.hide();
    this.logInButton.hide();
    this.account.hide();
  }

  draw() {
      this.p5.background(220);

      this.p5.image(this.back, 0, 0);
      this.p5.image(this.logo, 90, 20);

      this.p5.fill(255);
      this.p5.rect(0, 200, 390, 650); // Recuadro blanco

      this.p5.fill('#21272A');
      this.p5.textSize(32);
      this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
      this.p5.textStyle(this.p5.BOLD)
  
      // Texto principal
      this.p5.text("Log In", 80, 260);
  
      // Subtítulos
      this.p5.textSize(14);
      this.p5.textStyle(this.p5.NORMAL)
      this.p5.text("Email", 45, 330);
      this.p5.text("Password", 58, 440);

      this.p5.textSize(16);

      // Mostrar campos de entrada y botón
      this.emailInput.show();
      this.passwordInput.show();
      this.logInButton.show();
      this.account.show()

      // Dibujar la línea divisoria
      this.p5.line(20, 670, 370, 670);

      if(this.error == true){
        this.emailInput.hide();
        this.passwordInput.hide();
        this.logInButton.hide();

        // Dibujar el fondo oscuro
        this.p5.rectMode(this.p5.CORNER);
        this.p5.fill(0, 0, 0, 150);
        this.p5.rect(0, 0, this.p5.width, this.p5.height);

        // Dibujar el cuadro blanco del overlay
        this.p5.fill(255, 255, 255);
        this.p5.rect(45, 275, 300, 300, 10);
        this.p5.image(this.errorimg, 130, 320);

        this.p5.fill(0);
        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
        this.p5.text(
          'Email/Password is not valid',
          this.p5.width / 2,
          this.p5.height / 2 + 70,
        );

        this.p5.fill (0);
        this.p5.text('Please check',
        this.p5.width / 2,
        this.p5.height / 2 + 90,)

        this.p5.textAlign(this.p5.LEFT, this.p5.BASELINE);
        }
  }
}