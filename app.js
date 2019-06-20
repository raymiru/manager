const config = require('config');
const express = require('express');
const write = require('./src/utilities/consoleWrap')(config.get('logLevel'));// Если 1, то пушутся только error и info, если 2 - то все, если 0 - то ничего.
const app = express();
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const server = http.createServer(app);
const io = require('socket.io')(server);
const websocket = require('./src/websocket')(io);
const db = require('./src/services/db')();


const port = process.env.PORT || '3500';
app.use(express.static(path.join(__dirname, './dist')));


app.set('port', port);
app.use(bodyParser.json());




app.get('/user', function (req, res) {
    write.log('Подключен пользователь');
    res.send('hello world1')
});


server.listen(port, () => {
    write.info(`App running on port: ${port}`)
});
