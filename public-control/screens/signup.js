export class CellPhoneSignUpScreen {
    constructor(p5) {
        this.p5 = p5;
    
        this.back;
        this.logo;

    
        this.socket = io.connect('http://localhost:5500', { path: '/real-time' });
    
        this.firstNameInput = new InputField(p5, 'First Name', 24, 340, 150, 30);
        this.lastNameInput = new InputField(p5, 'Last Name', 215, 340, 150, 30);
        this.emailInput = new InputField(p5, 'Email', 24, 440, 345, 30, 'email');
        this.passwordInput = new InputField(p5, 'Password', 24, 547, 345, 30, 'password');
        this.genderSelect = new SelectField(p5, 'Gender', 24, 665, 345, 30, ['Male', 'Female']);
        this.signUpButton = new Button(p5, 'Sign Up', 'blue', 20, 720, 350, 40);

        // Cargar imágenes
        this.back = this.p5.loadImage('img/backcel.png');
        this.logo = this.p5.loadImage('img/logocel.png');
        
      }

      setup(){
        this.p5.createCanvas(390, 844);
      }

      draw() {
        this.p5.background(220);

        this.p5.image(this.back,0,0);
        this.p5.image(this.logo, 90, 20);

        this.p5.fill(255);
        this.p5.rect(0, 200, 390, 650); // Recuadro blanco

        this.p5.fill(0);
        this.p5.textSize(32);
        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    
        // Texto principal
        this.p5.text("Sign Up", 80, 260);
    
        // Subtitulos
        this.p5.textSize(14);
        this.p5.text("First Name", 60, 320);
        this.p5.text("Last Name", 250, 320);
        this.p5.text("Email", 45, 420);
        this.p5.text("Password", 58, 525);
        this.p5.text("Gender", 50, 640);

        this.p5.textSize(16);
        this.firstNameInput.draw();
        this.lastNameInput.draw();
        this.emailInput.draw();
        this.passwordInput.draw();
        this.genderSelect.draw();
        this.signUpButton.draw();
      }
}

class InputField {
    constructor(p5, label, x, y, width, height) {
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.label = label;
        this.value = '';
        this.width = width;
        this.height = height;
        this.isFocused = false;
      }
  
    draw() {
      // Dibuja el campo de entrada
      this.p5.fill(255);
      this.p5.stroke(0);
      this.p5.rect(this.x, this.y, this.width, this.height);
  
      // Dibuja la etiqueta
      this.p5.fill(0);
      this.p5.textAlign(this.p5.LEFT, this.p5.CENTER);
      this.p5.text(this.label, this.x, this.y + this.height / 2);
  
      // Dibuja el valor ingresado
      this.p5.fill(0);
      this.p5.textAlign(this.p5.LEFT, this.p5.CENTER);
      this.p5.text(this.value, this.x + 10, this.y + this.height / 2);
  
      // Si el campo está enfocado, muestra el cursor intermitente
      if (this.isFocused && frameCount % 60 < 30) {
        this.p5.line(this.x + 10 + textWidth(this.value), this.y + 5, this.x + 10 + textWidth(this.value), this.y + this.height - 5);
      }
    }
  
    handleInput() {
      // Lógica para manejar la entrada de texto (teclado/táctil)
      if (this.isFocused) {
        if (keyIsPressed && keyCode !== BACKSPACE && keyCode !== ENTER) {
          this.value += key;
        } else if (keyCode === BACKSPACE && this.value.length > 0) {
          this.value = this.value.slice(0, -1);
        }
      }
    }
  
    handleClick(mx, my) {
      // Verifica si se hizo clic en el campo
      if (mx > this.x && mx < this.x + this.width && my > this.y && my < this.y + this.height) {
        this.isFocused = true;
      } else {
        this.isFocused = false;
      }
    }
}
  
class SelectField {
    constructor(p5, label, x, y, width, height, options) {
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.label = label;
        this.options = options;
        this.selectedOption = '';
        this.width = width;
        this.height = height;
        this.isExpanded = false;
      }
  
    draw() {
      // Dibuja el campo de selección
      this.p5.fill(255);
      this.p5.stroke(0);
      this.p5.rect(this.x, this.y, this.width, this.height);
  
      // Dibuja la etiqueta
      this.p5.fill(0);
      this.p5.textAlign(this.p5.LEFT, this.p5.CENTER);
      this.p5.text(this.label, this.x, this.y + this.height / 2);
  
      // Dibuja la opción seleccionada
      this.p5.fill(0);
      this.p5.textAlign(this.p5.LEFT, this.p5.CENTER);
      this.p5.text(this.selectedOption, this.x + 10, this.y + this.height / 2);
    }
  
    handleClick(mx, my) {
      // Verifica si se hizo clic en el campo de selección
      if (mx > this.x && mx < this.x + this.width && my > this.y && my < this.y + this.height) {
        this.isExpanded = !this.isExpanded;
      } else {
        this.isExpanded = false;
      }
    }
  
    handleSelection(mx, my) {
      // Verifica si se hizo clic en una opción cuando el campo de selección está expandido
      if (this.isExpanded) {
        for (let i = 0; i < this.options.length; i++) {
          const optionY = this.y + this.height + i * this.height;
          if (mx > this.x && mx < this.x + this.width && my > optionY && my < optionY + this.height) {
            this.selectedOption = this.options[i];
            this.isExpanded = false;
            break;
          }
        }
      }
    }
}

class Button {
    constructor(p5, label, color, x, y, width, height) {
      this.p5 = p5;
      this.label = label;
      this.color = color;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  
    draw() {
      this.p5.fill(this.color);
      this.p5.rect(this.x, this.y, this.width, this.height);
      this.p5.fill(255);
      this.p5.textSize(18);
      this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
      this.p5.text(this.label, this.x + this.width / 2, this.y + this.height / 2);
    }
}