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

const signUp = async(io, userData) => {
  try {
    const {email, password} = userData
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(user);
    if (user) {
      io.emit('letsGame',{uid: user.uid})
    }
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    return error;
  }
}

const logIn = async(io, userData) => {
  const {email, password} = userData
  await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    if (user) {
      io.emit('letsGame')
    }
    return user;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    return error;
  });
}

const db = getFirestore(app);

const addUsersDB = async(uid, userData) => {
try {
  const { firstname, lastname, email, img } = userData;
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
    console.error("Error adding document: ", e);
    return false
}}

const addUsersScoresDB = async(scoreData) => {
  try {
    const { score } = scoreData;
    const userDocRef = doc(db, "users", uidUser);

    await updateDoc(userDocRef, {
      score: score
    });

    console.log("Document written with ID: ", uidUser);
    return true
    } catch (e) {
      console.error("Error adding document: ", e);
      return false
  }}

const getUsersDB = async (io) => {
  try {
    const users = [];
    const q = query(collection(db, "users"), orderBy("score", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(doc.id, " => ", data);
        users.push(data);
    });

    io.emit('sendUsers', users);

    return users;
} catch (error) {
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

    socket.on('logIn', () => {
      io.emit('logIn');
    });

    socket.on('signUpData', async userData => {
      const user = await signUp(io, userData);
        if (user) {
            await addUsersDB(user.uid, userData);
            uidUser = user.uid;
        }
        io.emit('signUpData', userData);
    });

    socket.on('logInData', async userData => {
      await logIn(io, userData);
      io.emit('logInData', userData);
    });

    socket.on('letsGame', () => {
      io.emit('letsGame');
    });

    socket.on('userScore', async scoreData => {
      await addUsersScoresDB(scoreData);
      io.emit('userScore', scoreData);
    });

    socket.on('requestUsers', async () => {
      const users = await getUsersDB(io);
      io.emit('sendUsers', users);
    });

    socket.on('playersScores', () => {
      io.emit('playersScores');
    });
    
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

