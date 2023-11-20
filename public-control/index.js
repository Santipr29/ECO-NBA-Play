import { CellPhoneGameScreen } from './screens/game.js';
import { CellPhoneMainScreen } from './screens/main.js';
import { CellPhoneSignUpScreen } from './screens/signup.js';
import { CellPhoneLogInScreen } from './screens/login.js';

const app = (p5) => {
  let currentScreen = 'main';
  let currentScreenInstance;
  let socket;
  const cellPhoneGameScreen = new CellPhoneGameScreen(p5);
  

  const changeScreen = (screen) => {
    currentScreen = screen;

    // Crear una nueva instancia de la pantalla actual.
    if (currentScreen === 'main') {
      currentScreenInstance = new CellPhoneMainScreen(p5, changeScreen);
    } else if (currentScreen === 'logIn') {
      currentScreenInstance = new CellPhoneLogInScreen(p5, changeScreen);
    } else if (currentScreen === 'signUp') {
      currentScreenInstance = new CellPhoneSignUpScreen(p5, changeScreen);
    }

    // Configurar la pantalla actual.
    currentScreenInstance.setup();
  };

  // Configuración inicial de p5.js
  p5.setup = () => {
    socket = io.connect('http://localhost:5500', { path: '/real-time' });
    changeScreen('main');

    socket.on('logIn', () => {
      changeScreen('logIn');
    });

    socket.on('signUp', () => {
      changeScreen('signUp');
    });
    //cellPhoneGameScreen.setup();
  };

  // Función de dibujo de p5.js
  p5.draw = () => {
    //cellPhoneGameScreen.draw();
    currentScreenInstance.draw();
  };

  // Manejar eventos táctiles
  p5.touchStarted = () => {
    cellPhoneGameScreen.touchStarted();
  };

  p5.touchEnded = () => {
    cellPhoneGameScreen.touchEnded();
  };
};

// Iniciar la aplicación p5
new p5(app);