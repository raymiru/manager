const write = require('./utilities/consoleWrap')(require('config').get('logLevel'));

let CONNECTED_USERS = [];
let users = [
    {
        username: 'ray',


    }, {}


]

module.exports = (io) => {
    write.log('Websocket module required');
    io.on('connection', socket => {
        socket.on('auth', data => {
            socket.username = data.username;
            CONNECTED_USERS.push(socket);
            CONNECTED_USERS.forEach(element => {
                console.log(element.username)
            })
            socket.emit('auth', {
                auth: 'success'
            });
        });

        socket.on('disconnect', () => {
            console.log('DISCONNECT: ' + socket.username);
            CONNECTED_USERS.forEach((element, index, array) => {
                if (element.username === socket.username) {
                    array.splice(index, 1);
                }
            })
            console.log('CONNECTED USERS: ' + CONNECTED_USERS)
        });


        socket.on('match', data => {
            console.log(data)
        })

        socket.on('info', data => {
            console.log(data)
        })
    });

    io.on('connect', socket => {
        console.log('user connected')
    })
};


