const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

io.on("connection", function(socket){
    socket.on("newusert", function(username){
        socket.broadcast.emit("ubdate", username + " joined the chat");
    });

    socket.on("exituser", function(username){
        socket.broadcast.emit("ubdate", username + " left the chat");
    }); 
    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    });
});

 

app.use(express.static(path.join(__dirname, 'public')));

server.listen(5000);