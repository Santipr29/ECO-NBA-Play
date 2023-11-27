// Importar las pantallas
import { MupiGameScreen } from './screens/game.js';
import {MupiQRScreen} from './screens/qr.js'
import { MupiMainScreen } from './screens/main.js';
import { MupiScoreScreen } from './screens/scores.js';

const app = (p5) => {
  //Estado de pantallas
  let currentScreen = 'qr';
  let currentScreenInstance;
  let socket;

  //Cambio de pantalla
  const changeScreen = (screen) => {
    currentScreen = screen;

    // Crear una nueva instancia de la pantalla actual.
    if (currentScreen === 'qr') {
      currentScreenInstance = new MupiQRScreen(p5, changeScreen);
    } else if (currentScreen === 'main') {
      currentScreenInstance = new MupiMainScreen(p5, changeScreen);
    } else if (currentScreen === 'game') {
      currentScreenInstance = new MupiGameScreen(p5, changeScreen);
    } else if (currentScreen === 'scores') {
      currentScreenInstance = new MupiScoreScreen(p5, changeScreen);
    } 
    // Configurar la pantalla actual.
    currentScreenInstance.setup();
  };

  // Configuración de la pantalla correspondiente al estado
  p5.setup = () => {
    socket = io.connect('https://3c46-2800-484-c3f-1e00-11ae-8db6-3931-13ec.ngrok-free.app/', { path: '/real-time' });
    changeScreen('qr');

    //Recibir los mensajes del servidor para hacer los cambios de pantallas
    socket.on('logIn', () => {
      changeScreen('main');
    });

    socket.on('signUp', () => {
      changeScreen('main');
    });

    socket.on('letsGame', () => {
      changeScreen('game');
    });

    socket.on('playersScores', () => {
      changeScreen('scores');
    });

    socket.on('restart', () => {
      changeScreen('qr');
    });
  };

  // Función de dibujo de p5.js
  p5.draw = () => {
    currentScreenInstance.draw();
  };

};

// Iniciar la aplicación p5
new p5(app);