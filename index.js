import express from 'express';
import { Server } from 'socket.io';
const PORT = 5500;

const expressApp = express()
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

const io = new Server(httpServer, {path: '/real-time'});

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('launchBall', (data) => {
        io.emit('ballLaunched', data);
    });

    socket.on('ballDropped', () => {
        io.emit('ballDropped');
    });
});

