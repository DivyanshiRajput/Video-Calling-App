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
        console.log("user disconnected");
      });
    });
});

server.listen(process.env.PORT || 3000);
