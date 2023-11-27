//Importar pantallas
import { CellPhoneGameScreen } from './screens/game.js';
import { CellPhoneMainScreen } from './screens/main.js';
import { CellPhoneSignUpScreen } from './screens/signup.js';
import { CellPhoneLogInScreen } from './screens/login.js';

const app = (p5) => {
  //Estado de pantallas
  let currentScreen = null;
  let currentScreenInstance = null;
  let socket;

  //Cambio de pantalla
  const changeScreen = (newScreen) => {
    if (currentScreenInstance) {
      currentScreenInstance.clear();
    }

    currentScreen = newScreen;

    // Crear una nueva instancia de la pantalla actual.
    if (currentScreen === 'main') {
      currentScreenInstance = new CellPhoneMainScreen(p5, changeScreen);
    } else if (currentScreen === 'logIn') {
      currentScreenInstance = new CellPhoneLogInScreen(p5, changeScreen);
    } else if (currentScreen === 'signUp') {
      currentScreenInstance = new CellPhoneSignUpScreen(p5, changeScreen);
    } else if (currentScreen === 'game') {
      currentScreenInstance = new CellPhoneGameScreen(p5, changeScreen);
    }
    // Configurar la pantalla actual.
    currentScreenInstance.setup();
  };

  // Configuración de la pantalla correspondiente al estado
  p5.setup = () => {
    socket = io.connect('http://localhost:5500', { path: '/real-time' });

    changeScreen('main');
    
    //Recibir los mensajes del servidor para hacer los cambios de pantallas
    socket.on('logIn', () => {
      changeScreen('logIn');
      currentScreenInstance.clear()
    });

    socket.on('signUp', () => {
      changeScreen('signUp');
      currentScreenInstance.clear()
    });

    socket.on('letsGame', () => {
      changeScreen('game');
    });

    socket.on('restart', () => {
      changeScreen('main');
    });
  };

  // Función de dibujo de p5.js
  p5.draw = () => {
    currentScreenInstance.draw();
  };

  // Manejar eventos táctiles
  p5.touchStarted = () => {
    if (currentScreen === 'game') {
      currentScreenInstance.touchStarted()
    }
  };

  p5.touchEnded = () => {
    if (currentScreen === 'game') {
      currentScreenInstance.touchEnded()
    }
  };
};

// Iniciar la aplicación p5
new p5(app);