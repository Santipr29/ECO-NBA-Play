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
            'Controller:': 'http://localhost:5500/controller',
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

//Iniciar el servidor
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

    socket.on('letsGame', () => {
      io.emit('letsGame');
    });

    socket.on('playersScores', () => {
      io.emit('playersScores');
    });
    
    socket.on('restart', () => {
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

