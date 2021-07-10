const firebase = require("firebase");

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

var FIREBASE_CONFIG = {
     apiKey: "AIzaSyAF1i5MloeErcq7ErFcnEEsEg4CGM5Enps",
     authDomain: "teams-clone-a921c.firebaseapp.com",
     databaseURL: "https://teams-clone-a921c-default-rtdb.firebaseio.com",
     projectId: "teams-clone-a921c",
     storageBucket: "teams-clone-a921c.appspot.com",
     messagingSenderId: "24512433115",
     appId: "1:24512433115:web:85d0bd97e77414338e75fe",
     measurementId: "G-R1EGVPHZ3R"
   };

firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.database();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.get('/create', function(req, res){
    var uuid = uuidv4()
    var chat_room_ref = db.ref("Chatroom/" + uuid);
    chat_room_ref.push({
      userName: "Server",
      timestamp: Date.now(),
      message: "This is the beginning of the chat"
    });
    res.redirect(`/${uuid}`);
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

app.get('/:room/chatroom', function(req, res){
    res.render('chatroom', {roomId: req.params.room});
})

app.get('/:room/chatroom/leave', function(req, res){
    var room = req.params.room;
    res.redirect(`/${room}/leave`);
})

socketIo.on('connection', socket => {

    socket.on('join-room', (roomId, userId, userName, type) => {
      socket.join(roomId);

      if (type == "video"){
        socket.to(roomId).emit('user-connected', userId, userName);
        console.log("joined room");
      }

      else{
        socket.to(roomId).emit('user-connected-chat', userId, userName);
        console.log("joined chat room");
      }

      socket.on('message', function(message){
        socketIo.to(roomId).emit('createMessage', message, userName.substring(0, userName.length - 3));
      });

      socket.on('disconnect', id => {
        socket.to(roomId).emit('user-disconnected', userId, userName);
        console.log("user disconnected");
      });

      socket.on('mute', (userId, userName) => {
        socket.to(roomId).emit('user-mute', userId, userName);
      });

      socket.on('unmute', (userId, userName) => {
        socket.to(roomId).emit('user-unmute', userId, userName);
      });
    });
});

server.listen(process.env.PORT || 3000);
