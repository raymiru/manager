const config = require('config');
const useragent = require('useragent');
const playersFilter = require('./src/services/liveScore/playersFilter');
const to = require('await-to-js').default;
const express = require('express');
const port = process.env.PORT || '3500';
const write = require('./src/utilities/consoleWrap')(config.get('logLevel'));// Если 1, то пушутся только error и info, если 2 - то все, если 0 - то ничего.
const app = express();
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const server = http.createServer(app);
const io = require('socket.io')(server);
// const db = require('./src/db')();


app.use(express.static(path.join(__dirname, '../nuxt-client/dist')));
app.set('port', port);
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());
app.use('/api/heroes', async (req, res, next) => {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        const data = await playersFilter(req.body.match_id);
        res.send({
            radiant_team: data.radiant_team,
            dire_team: data.dire_team
        })
    } catch (e) {
        res.send({
            radiant_team: [],
            dire_team: []
        })
    }
});

server.listen(port, () => {
    write.info(`App running on port: ${port}`)
});


(() => {
    const SocketListener = require('./src/services/SocketListener');
    const socketListener = new SocketListener();


    (() => {
        write.log('LIVE SCORE LISTENER');
        socketListener.liveScoreListener();
    })();
    io.on('connection',(socket) => {
        console.log(socket.handshake.query.im)
        socketListener.auth(socket);
        socketListener.disconnect(socket);

        if (socket.handshake.query.im === 'player') {
            socketListener.playersSync(socket);
        }
        else if (socket.handshake.query.im === 'watcher') {
            socketListener.matchListFromWatcher(socket);
        }
        else if (socket.handshake.query.im === 'oddsWatcher') {
            socketListener.betsOdds(socket)
        }
        else if (socket.handshake.query.im === 'admin') {
            socketListener.winnerListener(socket);
            socketListener.test(socket);
        }
    });
})();














