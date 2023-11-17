// Importar la clase MupiGameScreen desde el archivo 'game.js'
import { MupiGameScreen } from './screens/game.js';
import {MupiQRScreen} from './screens/qr.js'
import { MupiMainScreen } from './screens/main.js';

const app = (p5) => {
  // Crear una instancia de la clase MupiGameScreen
  const mupiGameScreen = new MupiGameScreen(p5);
  const mupiQRScreen = new MupiQRScreen(p5);
  const mupiMainScreen = new MupiMainScreen(p5);

  // Configuración inicial de p5.js
  p5.setup = () => {
    //mupiGameScreen.setup();
    //mupiQRScreen.setup();
    mupiMainScreen.setup();
  };

  // Función de dibujo de p5.js
  p5.draw = () => {
    //mupiGameScreen.draw();
    //mupiQRScreen.draw();
    mupiMainScreen.draw();
  };
};

// Iniciar la aplicación p5
new p5(app);