// Importar la clase MupiGameScreen desde el archivo 'game.js'
import { MupiGameScreen } from './screens/game.js';
import {MupiQRScreen} from './screens/qr.js'
import { MupiMainScreen } from './screens/main.js';
import { MupiScoreScreen } from './screens/scores.js';

const app = (p5) => {
  let currentScreen = 'qr';
  let currentScreenInstance;
  let socket;

  const changeScreen = (screen) => {
    currentScreen = screen;

    // Crear una nueva instancia de la pantalla actual.
    if (currentScreen === 'qr') {
      currentScreenInstance = new MupiQRScreen(p5, changeScreen);
    } else if (currentScreen === 'main') {
      currentScreenInstance = new MupiMainScreen(p5, changeScreen);
    } 
    // Configurar la pantalla actual.
    currentScreenInstance.setup();
  };

  // Configuración inicial de p5.js
  p5.setup = () => {
    socket = io.connect('http://localhost:5500', { path: '/real-time' });
    changeScreen('qr');

    socket.on('logIn', () => {
      changeScreen('main');
    });

    socket.on('signUp', () => {
      changeScreen('main');
    });
  };

  // Función de dibujo de p5.js
  p5.draw = () => {
    currentScreenInstance.draw();
  };
};

// Iniciar la aplicación p5
new p5(app);