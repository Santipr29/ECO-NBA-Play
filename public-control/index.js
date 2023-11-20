import { CellPhoneGameScreen } from './screens/game.js';
import { CellPhoneMainScreen } from './screens/main.js';
import { CellPhoneSignUpScreen } from './screens/signup.js';
import { CellPhoneLogInScreen } from './screens/login.js';

const app = (p5) => {
  const cellPhoneGameScreen = new CellPhoneGameScreen(p5);
  //const cellPhoneMainScreen = new CellPhoneMainScreen(p5);
  const cellPhoneSignUpScreen = new CellPhoneSignUpScreen(p5);
  //const cellPhoneLogInScreen = new CellPhoneLogInScreen(p5);

  // Configuración inicial de p5.js
  p5.setup = () => {
    //cellPhoneGameScreen.setup();
    //cellPhoneMainScreen.setup();
    cellPhoneSignUpScreen.setup();
    //cellPhoneLogInScreen.setup();
  };

  // Función de dibujo de p5.js
  p5.draw = () => {
    //cellPhoneGameScreen.draw();
    //cellPhoneMainScreen.draw();
    cellPhoneSignUpScreen.draw();
    //cellPhoneLogInScreen.draw();
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