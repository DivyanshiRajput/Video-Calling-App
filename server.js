const express = require('express');
const { isObject } = require('util');
const app = express();
const server = require('http').Server(app);
const socketIo = require('socket.io')(server);
const {v4: uuidv4} = require('uuid');
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.get('/create', function(req, res){
    res.redirect(`/${uuidv4()}`);
});

app.get('/', function(req, res){
    res.render('index');
})

app.get('/:room', function(req, res){
    res.render('room', {roomId: req.params.room});
});

app.get('/:room/leave', function(req, res){
    res.render('leave');
})

socketIo.on('connection', socket => {

    socket.on('join-room', (roomId, userId, userName) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', userId, userName);
      console.log("joined room");

      socket.on('message', function(message){
        socketIo.to(roomId).emit('createMessage', message, userName);
      });

      socket.on('disconnect', id => {
        socket.to(roomId).emit('user-disconnected', userId, userName);
        console.log ("user disconnected");
      });
    });
});

server.listen(3000);
