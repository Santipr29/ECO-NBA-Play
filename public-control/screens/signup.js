// export class CellPhoneSignUpScreen {
//   constructor(p5) {
//       this.p5 = p5;
  
//       this.back;
//       this.logo;
  
//       this.socket = io.connect('http://localhost:5500', { path: '/real-time' });
  
//       // Crear campos de entrada y botón usando createInput y createButton
//       this.firstNameInput = p5.createInput().position(24, 340).size(150, 30);
//       this.lastNameInput = p5.createInput().position(215, 340).size(150, 30);
//       this.emailInput = p5.createInput().position(24, 440).size(345, 30);
//       this.passwordInput = p5.createInput().position(24, 547).size(345, 30).attribute('type', 'password');
//       this.genderSelect = p5.createSelect().position(24, 665).size(345, 30);
//       this.signUpButton = p5.createButton('Sign Up').position(20, 720).size(350, 40).style('background-color', 'blue');

//       // Agregar opciones al campo de selección
//       this.genderSelect.option('Male');
//       this.genderSelect.option('Female');

//       // Cargar imágenes
//       this.back = this.p5.loadImage('img/backcel.png');
//       this.logo = this.p5.loadImage('img/logocel.png');
//   }

//   setup() {
//       this.p5.createCanvas(390, 844);
//   }

//   draw() {
//       this.p5.background(220);

//       this.p5.image(this.back, 0, 0);
//       this.p5.image(this.logo, 90, 20);

//       this.p5.fill(255);
//       this.p5.rect(0, 200, 390, 650); // Recuadro blanco

//       this.p5.fill(0);
//       this.p5.textSize(32);
//       this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
  
//       // Texto principal
//       this.p5.text("Sign Up", 80, 260);
  
//       // Subtítulos
//       this.p5.textSize(14);
//       this.p5.text("First Name", 60, 320);
//       this.p5.text("Last Name", 250, 320);
//       this.p5.text("Email", 45, 420);
//       this.p5.text("Password", 58, 525);
//       this.p5.text("Gender", 50, 640);

//       this.p5.textSize(16);

//       // Mostrar campos de entrada y botón
//       this.firstNameInput.show();
//       this.lastNameInput.show();
//       this.emailInput.show();
//       this.passwordInput.show();
//       this.genderSelect.show();
//       this.signUpButton.show();
//   }
// }