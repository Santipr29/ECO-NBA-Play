//Uso de librerias
import express from 'express';
import cors from 'cors'
import { Server } from 'socket.io';
import { SerialPort } from 'serialport'


//Puerto de la aplicacion
const PORT = 5500;

const expressApp = express()
expressApp.use(cors())

//URL del mupi y el control
const httpServer = expressApp.listen(PORT, () => {
    console.table(
        {
            'Controller:': 'http://localhost:5500/game',
            'Game:': 'http://localhost:5500/game',
        })
})

expressApp.use('/game', express.static('public-mupi'))
expressApp.use('/controller', express.static('public-control'))
expressApp.use(express.json())

//Conexion del arduino
// const port = new SerialPort({
//     path:'COM3',
//     baudRate:9600,

//   });

//Comportamiento del servidor
const io = new Server(httpServer, {
    path: '/real-time',
    cors: {
        origin: "*",
        methods: ["GET","POST"]
    }
});

//Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, onSnapshot, where, setDoc, doc, getDoc, updateDoc} from "firebase/firestore";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence} from "firebase/auth";

//Configuracion de la app de firebase
const firebaseConfig = {
  apiKey: "AIzaSyCI1veTV4rnpeg-Fn220rwVvDh1ihOpf4U",
  authDomain: "dca-perez.firebaseapp.com",
  projectId: "dca-perez",
  storageBucket: "dca-perez.appspot.com",
  messagingSenderId: "116722604539",
  appId: "1:116722604539:web:62b7afc51095347ef1535e",
  measurementId: "G-M6EX5SP9ML"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let uidUser;

//Funcion de Sign Up con firebase
const signUp = async(io, userData) => {
  try {
    const {email, password} = userData
    //Funcion de Sign Up de firebase a partir de los datos obtenidos
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(user);
    if (user) {
      //Emitir el mensaje de comienzo de juego para cambiar las pantallas del mupi y el celular
      io.emit('letsGame',{uid: user.uid})
    }
    return user;
  } catch (error) {
    //Manejo de errores
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    return error;
  }
}

//Funcion de Log In con firebase
const logIn = async(io, userData) => {
  const {email, password} = userData
  //Funcion de Log In de firebase a partir de los datos obtenidos
  await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    if (user) {
      //Emitir el mensaje de comienzo de juego para cambiar las pantallas del mupi y el celular
      io.emit('letsGame')
    }
    return user;
  })
  .catch((error) => {
    //Manejo de errores
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    return error;
  });
}

const db = getFirestore(app);

//Funcion de agregar la informacion de los usuarios con firebase
const addUsersDB = async(uid, userData) => {
try {
  const { firstname, lastname, email, img } = userData;
  //Agregar el usuario a la coleccion de users creandolo con el id obtenido en la parte de auth de firebase
    await setDoc(doc(db, "users", uid),{
        first: firstname,
        last:lastname,
        email:email,
        img: img,
        score: 0,
    })
    console.log("Document written with ID: ", uid);
    return true
  } catch (e) {
    //Manejo de errores
    console.error("Error adding document: ", e);
    return false
}}

//Funcion de editar la informacion de los usuarios con firebase
const addUsersScoresDB = async(scoreData) => {
  try {
    const { score } = scoreData;
    //Editar el usuario a la coleccion de users a partir del id obtenido en la parte de auth de firebase
    const userDocRef = doc(db, "users", uidUser);

    await updateDoc(userDocRef, {
      score: score
    });

    console.log("Document written with ID: ", uidUser);
    return true
    } catch (e) {
      //Manejo de errores
      console.error("Error adding document: ", e);
      return false
  }}

//Funcion de obtener la informacion de los usuarios con firebase
const getUsersDB = async (io) => {
  try {
    const users = [];
    //Obtener los usuarios de la coleccion users y ordenarlos por el score de mayor a menor
    const q = query(collection(db, "users"), orderBy("score", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(doc.id, " => ", data);
        users.push(data);
    });

    //Enviar el arreglo con los usurios a la pantalla de scores
    io.emit('sendUsers', users);

    return users;
} catch (error) {
    //Manejo de errores
    console.error("Error getting users: ", error);
    return [];
}
};

//Iniciar el servidor con sockets
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    //Lanzamiento del balon
    socket.on('launchBall', (data) => {
        io.emit('ballLaunched', data);
    });

    //Caida del balon y reseteo en el celular
    socket.on('ballDropped', () => {
        io.emit('ballDropped');
    });

    //Cambio de pantallas
    socket.on('signUp', () => {
      io.emit('signUp');
    });

    //Cambio de pantallas
    socket.on('logIn', () => {
      io.emit('logIn');
    });

    //Sign Up
    socket.on('signUpData', async userData => {
      //Recibe los datos de los inputs de la pantalla de Sign Up y los utiliza en la funcion de Firebase
      const user = await signUp(io, userData);
        if (user) {
          //Si se agrega el usuario en la parte de auth de Firebase, agregarlo en la coleccion de Firebase
            await addUsersDB(user.uid, userData);
            uidUser = user.uid;
        }
        io.emit('signUpData', userData);
    });

    //Log In
    socket.on('logInData', async userData => {
      //Recibe los datos de los inputs de la pantalla de Log In y los utiliza en la funcion de Firebase
      await logIn(io, userData);
      io.emit('logInData', userData);
    });

    //Cambio de pantallas
    socket.on('letsGame', () => {
      io.emit('letsGame');
    });

    //Configurar el score del usuario que esta jugando
    socket.on('userScore', async scoreData => {
      //Configura el score del usuario que esta jugando
      await addUsersScoresDB(scoreData);
      io.emit('userScore', scoreData);
    });

    //Obtener los usuarios de nuestra coleccion de Firebase
    socket.on('requestUsers', async () => {
      const users = await getUsersDB(io);
      io.emit('sendUsers', users);
    });

    //Cambio de pantallas
    socket.on('playersScores', () => {
      io.emit('playersScores');
    });
    
    //Cambio de pantallas
    socket.on('restart', () => {
      uidUser = 0,
      io.emit('restart');
    });

    //Arduino LED
    socket.on('mensaje', (estadoRecibido) => {

        let estadoBoolean = estadoRecibido;
        console.log('Estado booleano recibido:', estadoRecibido);

        // Convertir el estado booleano a un valor '1' o '0' para controlar el LED en el Arduino
        const comando = estadoBoolean ? '1' : '0';

        enviarAlArduino(comando); // Enviar el comando al Arduino basado en el estado booleano
    });

      function enviarAlArduino(comando) {
        if (port.isOpen) {
          port.write(comando); // Enviar comando al Arduino a través del puerto serial
          console.log('Comando enviado al Arduino:', comando);
        } else {
          console.log('No se pudo enviar. La conexión serial no está abierta.');
        }
      };

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

