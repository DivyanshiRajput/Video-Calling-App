const express = require('express');
const app = express();
const server = require('http').Server(app);

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    console.log("hello world");
    res.render('room');
});





server.listen(3000);