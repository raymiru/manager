const write = require('./utilities/consoleWrap')(require('config').get('logLevel'));
const liveScoreWorker = require('./services/liveScore/liveScoreWorker');
const da = require('./services/liveScore/steamApi')

let watcherSocket = null;
let adminSocket = null;
let connected_users = [];
let matches = [];
let currentLiveSCore = [];
let mWorker = [];

/*
Authentication Listener
 */
const authenticationListener = socket => {
    socket.on('auth', data => {
        socket.username = data.username;
        write.info('AUTH: ' + data.username);
        connected_users.push(socket);

        socket.emit('auth', {
            auth: 'success'
        });

        if (socket.username === 'watcher') {
            watcherSocket = socket
        }
        if (socket.username === 'admin') {
            adminSocket = socket;
            // отправляем админу список матчей при аутентификации
            adminSocket.emit('import_matches', matches);
            // TODO отправить данные админу при подключении
            // adminSocket.emit('steamApi', bWorker)
        }
    });
};

/*
Disconnect Listener
 */
const disconnectListener = socket => {
    socket.on('disconnect', () => {
        write.info('DISCONNECT: ' + socket.username);
        if (socket.username === 'admin') {
            adminSocket = null;
            write.warn('admin disconnect')
        }
        if (socket.username === 'watcher') {
            watcherSocket = null;
            write.warn('watcher disconnect')
        }
        connected_users.forEach((element, index, array) => {
            if (element.username === socket.username) {
                array.splice(index, 1);
            }
        })
    });
};

/*
Получение матчей от вотчера
 */
const watcherListener = socket => {
    socket.on('match_list_from_watcher', data => {
        //init
        if (!matches) matches = data;
        // проверка на разницу количества матчей
        else if (matches.length !== data.length) {
            console.log('Запись матчей, не равно количество матчей');
            matches = data;
            if (adminSocket) {
                adminSocket.emit('import_matches', matches)
            }
        }
        // проверка на совпадение статуса
        matches.forEach((elem, index, array) => {
            if (array[index].STATUS !== data[index].STATUS) {
                console.log('Запись матчей, не равны статусы');
                matches = data
                if (adminSocket) {
                    adminSocket.emit('import_matches', matches)
                }
            }
        })
    });
};

/*
Получение коэффициентов и максимальной ставки
 */
const betsOddsListener = socket => {
    socket.on('updatematch_dota', data => {
        let id = JSON.parse(data).id;
        try {
            matches.forEach(match => {
                if (match.LIVE_DATA_IDS) {
                    if (match.LIVE_DATA_IDS.includes(id.toString())) {
                        if (adminSocket) {
                            console.log(data)
                            adminSocket.emit(`${match.DATA_ID}`, data)
                        }
                    }
                }
            })
        } catch (e) {
            console.log(e)
        }
    });
};

/*
Проверка подключенных пользователей
 */
const watchConnectedUsers = (timeout) => {
    setTimeout(() => {
        connected_users.forEach(elem => {
            write.info(elem.username)
        })
    }, timeout)
};

/*
Steam Api Match Details Winner Listener
 */
const winnerListener = socket => {
    socket.on('check_winner', data => {
        console.log(data.match_id);
            da.getMatchDetails({match_id: data.match_id}).then(result => {
                if (result.result.match_id) {
                    adminSocket.emit(data.data_id, {
                        radiant_win: result.result.radiant_win
                    })
                } else {
                    console.log(result)
                }

            })
    });
};

/*
Steam Api Live Score Listener
 */
const liveScoreListener = () => {
    liveScoreWorker().then(result => {
        if (adminSocket) adminSocket.emit('steamApi', result)
    });

    // da.getTopLiveGame(daOptions).then((result) => {
    //     if (result.game_list) {
    //         mWorker = matchWorker(result);
    //         if (JSON.stringify(bWorker) !== JSON.stringify(mWorker)) {
    //             bWorker = mWorker
    //             if (adminSocket) adminSocket.emit('steamApi', bWorker)
    //         }
    //     }
    // }, error => {
    //     console.log(error)
    // });
     setTimeout(liveScoreListener, 2000)
};

liveScoreListener(currentLiveSCore);

module.exports = (io) => {
    write.log('Websocket module required');
    io.on('connection', socket => {
        authenticationListener(socket);
        disconnectListener(socket);
        watcherListener(socket);
        betsOddsListener(socket);
        winnerListener(socket)
    });
};
