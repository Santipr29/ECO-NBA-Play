// Importar la clase CellPhoneGameScreen desde el archivo 'cellphone.js'
import { CellPhoneGameScreen } from './screens/game.js';

const app = (p5) => {
  // Crear una instancia de la clase CellPhoneGameScreen
  const cellPhoneGameScreen = new CellPhoneGameScreen(p5);

  // Configuración inicial de p5.js
  p5.setup = () => {
    cellPhoneGameScreen.setup();
  };

  // Función de dibujo de p5.js
  p5.draw = () => {
    cellPhoneGameScreen.draw();
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