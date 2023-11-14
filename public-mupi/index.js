// Importar la clase MupiGameScreen desde el archivo 'game.js'
import { MupiGameScreen } from './screens/game.js';

const app = (p5) => {
  // Crear una instancia de la clase MupiGameScreen
  const mupiGameScreen = new MupiGameScreen(p5);

  // Configuración inicial de p5.js
  p5.setup = () => {
    mupiGameScreen.setup();
  };

  // Función de dibujo de p5.js
  p5.draw = () => {
    mupiGameScreen.draw();
  };
};

// Iniciar la aplicación p5
new p5(app);