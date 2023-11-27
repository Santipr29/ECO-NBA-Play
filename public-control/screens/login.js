export class CellPhoneLogInScreen {
    constructor(p5, changeScreen) {
        this.p5 = p5;
    
        this.back;
        this.logo;
    
        this.socket = io.connect('http://localhost:5500', { path: '/real-time' });
    
        // Crear campos de entrada y botón usando createInput y createButton
        this.emailInput = p5.createInput().position(24, 350).size(332, 30).attribute('type', 'email');
        this.emailInput.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');
  
        this.passwordInput = p5.createInput().position(24, 460).size(332, 30).attribute('type', 'password');
        this.passwordInput.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');
  
        this.logInButton = p5.createButton('Log In').position(20, 580).size(350, 40);
        this.logInButton.style('background-color', '#006AB7').style('border-radius', '10px').style('border', '2px solid #0F62FE').style('font-size', '16px').style('color', 'white').style('font-weight', 'bold');
  
        this.account = p5.createButton('No account yet? Sign Up').position(19, 720);
        this.account.style('background-color', 'transparent').style('border', '1px solid transparent').style('font-size', '14px').style('color', '#001D6C').style('font-weight', 'regular');
  
        // Cargar imágenes
        this.back = this.p5.loadImage('img/backcel.png');
        this.logo = this.p5.loadImage('img/logocel.png');
  
        this.logInButton.touchStarted(() => {
          const email = this.emailInput.value();
          const password = this.passwordInput.value();
  
          this.socket.emit('logInData', {email: email, password: password})
        });
  
        this.account.touchStarted(() => {
          this.socket.emit('signUp')
        });

        this.changeScreen = changeScreen;
        this.setup();
    }
  
    setup() {
        this.p5.createCanvas(390, 844);
    }

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
    }
  }