export class CellPhoneSignUpScreen {
    constructor(p5, changeScreen) {
      this.p5 = p5;
  
      this.back;
      this.logo;
  
      this.socket = io.connect('http://localhost:5500', { path: '/real-time' });
  
      // Crear campos de entrada y botón usando createInput y createButton
      this.firstNameInput = p5.createInput().position(20, 320).size(150, 30);
      this.firstNameInput.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');

      this.lastNameInput = p5.createInput().position(213, 320).size(150, 30);
      this.lastNameInput.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');

      this.emailInput = p5.createInput().position(20, 420).size(345, 30).attribute('type', 'email');
      this.emailInput.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');

      this.passwordInput = p5.createInput().position(20, 520).size(345, 30).attribute('type', 'password');
      this.passwordInput.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');

      this.genderSelect = p5.createSelect().position(20, 620).size(350, 40);
      this.genderSelect.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');

      this.signUpButton = p5.createButton('Sign Up').position(20, 700).size(350, 40);
      this.signUpButton.style('background-color', '#D71E54').style('border-radius', '10px').style('border', '2px solid #F43F74').style('font-size', '16px').style('color', 'white').style('font-weight', 'bold');

      this.account = p5.createButton('Already have an account?').position(19, 780);
      this.account.style('background-color', 'transparent').style('border', '1px solid transparent').style('font-size', '14px').style('color', '#001D6C').style('font-weight', 'regular');

      // Agregar opciones al campo de selección
      this.genderSelect.option('Male');
      this.genderSelect.option('Female');

      // Cargar imágenes
      this.back = this.p5.loadImage('img/backcel.png');
      this.logo = this.p5.loadImage('img/logocel.png');

      this.signUpButton.mousePressed(() => {
        const email = this.emailInput.value();
        const password = this.passwordInput.value();

        this.socket.emit('signUpData', {email: email, password: password})
      });

      this.account.mousePressed(() => {
        this.socket.emit('logIn')
      });

      this.changeScreen = changeScreen;
      this.setup();
  }

  setup() {
      this.p5.createCanvas(390, 844);
  }

  clear(){
    this.firstNameInput.hide();
    this.lastNameInput.hide();
    this.emailInput.hide();
    this.passwordInput.hide();
    this.genderSelect.hide();
    this.signUpButton.hide();
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
      this.p5.text("Sign Up", 80, 250);
  
      // Subtítulos
      this.p5.textSize(14);
      this.p5.textStyle(this.p5.NORMAL)
      this.p5.text("First Name", 55, 300);
      this.p5.text("Last Name", 248, 300);
      this.p5.text("Email", 38, 400);
      this.p5.text("Password", 52, 500);
      this.p5.text("Gender", 45, 600);

      this.p5.textSize(16);

      // Mostrar campos de entrada y botón
      this.firstNameInput.show();
      this.lastNameInput.show();
      this.emailInput.show();
      this.passwordInput.show();
      this.genderSelect.show();
      this.signUpButton.show();
      this.account.show()

      // Dibujar la línea divisoria
      this.p5.line(20, 770, 370, 770);
  }
}