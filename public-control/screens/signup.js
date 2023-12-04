export class CellPhoneSignUpScreen {
  constructor(p5, changeScreen) {
    this.p5 = p5;

    this.back;
    this.logo;
    this.errorimg;
    this.error = false;

    this.socket = io.connect('https://41f4-2800-484-c3f-1e00-2d18-69d8-7ff0-b903.ngrok-free.app', { path: '/real-time' });

    // Crear campos de entrada y botón usando createInput y createButton
    this.firstNameInput = p5.createInput().position(20, 320).size(150, 30);
    this.firstNameInput.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');

    this.lastNameInput = p5.createInput().position(213, 320).size(150, 30);
    this.lastNameInput.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');

    this.emailInput = p5.createInput().position(20, 420).size(345, 30).attribute('type', 'email');
    this.emailInput.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');

    this.passwordInput = p5.createInput().position(20, 520).size(345, 30).attribute('type', 'password').attribute('placeholder', 'min 6 characters');
    this.passwordInput.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');

    this.genderSelect = p5.createSelect().position(20, 620).size(350, 40);
    this.genderSelect.style('background-color', '#F2F4F8').style('border-radius', '10px').style('border', '2px solid #C1C7CD').style('font-size', '16px').style('color', '#697077').style('font-weight', 'regular');

    //Crear botones para enviar informacion del Sign Up o cambiar de pantalla para el Log In
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
    this.errorimg = this.p5.loadImage('img/error.png');

    //Darle click a los botones
    this.signUpButton.touchStarted(() => {
      //Tomar valores de los inputs
      const email = this.emailInput.value();
      const password = this.passwordInput.value();
      const firstname = this.firstNameInput.value();
      const lastname = this.lastNameInput.value()

      const gender = this.genderSelect.value();

      //Tomar el valor del campo de seleccion para mandar la informacion correspondiente
      let img = "";
      if (gender === "Male") {
        img = "img/usermale.png"; 
      } else if (gender === "Female") {
        img = "img/userfemale.png"; 
      }

      //Enviar los valores de los inputs al server
      this.socket.emit('signUpData', {firstname: firstname, lastname:lastname, email: email, password: password, img: img})
    });

    this.account.touchStarted(() => {
      //Cambiar de pantalla a Log In
      this.socket.emit('logIn')
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
        this.firstNameInput.show();
        this.lastNameInput.show();
        this.emailInput.show();
        this.passwordInput.show();
        this.genderSelect.show();
        this.signUpButton.show();
    }, 5000);
    });
}

//Eliminar elementos html
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

    if(this.error == true){
      this.firstNameInput.hide();
      this.lastNameInput.hide();
      this.emailInput.hide();
      this.passwordInput.hide();
      this.genderSelect.hide();
      this.signUpButton.hide();

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