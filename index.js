const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express ();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname +  '/public'));

server.listen(5500,() => {
    console.log ('escuchandingg');
});