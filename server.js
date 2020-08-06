const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());
app.use(express.static('views'));
require('./controllers/routes')(app);
require('./controllers/api')(app);
let port = process.env.PORT || 3000
const server = app.listen(port, () => console.log(`Server hosted at http://locahost:${port}`));
const io = require('socket.io').listen(server);

io.on('connection', (socket) => {
    console.log(socket.id + ' connected')
    socket.on('join', (room) =>{
        socket.join(room);
        console.log(socket.id, "joined", room);

    });
    socket.on('leave', function(room){
        socket.leave(room);
        console.log(socket.id, 'left', room);
    });
    socket.on('message', (evt) => {
        socket.to(evt.room).emit('message', evt.message);
    });
});
io.on('disconnect', (evt) => {
    console.log('some people left')
});
