const write = require('../../utilities/consoleWrap')(2);
const to = require('await-to-js').default;
const da = require('../liveScore/steamApi');
// const mongoose = require('mongoose');
// const Player = mongoose.model('Player');
const liveScoreWorker = require('../liveScore/liveScoreWorker');

module.exports = class SocketListener {
    constructor() {
        this.connectedSockets = {
            all: [],
            admin: null,
            watcher: null,
            oddsWatcher: null,
            players: []
        };
        this.match_list = [];
        this.players = [];
        this.currentLiveScore = {}
    }

    auth(socket) {
        const socketWorkWith = data => {
            socket.type = data.type;
            socket.username = data.username;
            this.connectedSockets.all.push(socket);
            socket.emit('auth', {auth: 'success'});

            if (socket.type === 'watcher') this.connectedSockets.watcher = socket;
            else if (socket.type === 'oddsWatcher') this.connectedSockets.oddsWatcher = socket;
            else if (socket.type === 'admin') {
                this.connectedSockets.admin = socket;
                this.connectedSockets.admin.emit('import_matches', this.match_list);
                this.connectedSockets.admin.emit('players_sync', this.players);
                liveScoreWorker().then(result => {
                    this.connectedSockets.admin.emit('live_score_api', result.game_list)
                })

            } else if (socket.type === 'player') {
                this.connectedSockets.players.push(socket);
                if (this.connectedSockets.admin) {
                    this.players.push({
                        type: data.type,
                        username: data.username,
                        info: data.info,
                        match: data.match,
                        bets: []
                    });
                    socket.emit('import_matches', this.match_list);
                    if (this.connectedSockets.admin) this.connectedSockets.admin.emit('players_sync', this.players)
                }
            }
        };

        const socketSave = data => {
            socket.emit('auth', {auth: 'success'});
            socket.info = data;
            this.connectedSockets.all.push(socket);
            if (socket.handshake.query.im === 'player') {
                this.connectedSockets.players.push(socket);
                this.players.push(data);
                if (this.connectedSockets.admin) this.connectedSockets.admin.emit('players_sync', this.players);
            } else if (socket.handshake.query.im === 'admin') {
                this.connectedSockets.admin = socket
                this.connectedSockets.admin.emit('import_matches', this.match_list);
                this.connectedSockets.admin.emit('players_sync', this.players);
                liveScoreWorker().then(result => {
                    this.connectedSockets.admin.emit('live_score_api', result.game_list)
                })

                // отправить стартовыне данные

            } else if (socket.handshake.query.im === 'watcher') {
                this.connectedSockets.watcher = socket
            } else if (socket.handshake.query.im === 'oddsWatcher') {
                this.connectedSockets.oddsWatcher = socket
            } else {
                write.error('No type');
            }
        };

        const socketAlreadyAuthenticated = data => {
            let result = false;
            this.connectedSockets.all.forEach(elem => {
                if (elem.info.username === data.username) {
                    result = true
                }
            });
            return result
        };

        socket.on('auth', data => {
            if (!socketAlreadyAuthenticated(data)) {
                write.info(`Connect: ${data.username}`);
                socketSave(data);
            } else {
                write.error(`Socket already authenticated: ${data.username}`)
            }
        })
    }

    playersSync(socket) {
        write.log('PLAYER SYNC LISTENER');
        socket.on('players_sync', data => {
            console.log('PLAYERS SYNC')
            this.players.forEach((elem, index, array) => {
                if (elem.username === socket.info.username) {
                    write.info('CHANGE')
                    array[index] = data
                }
            })
            if (this.connectedSockets.admin) this.connectedSockets.admin.emit('players_sync', this.players);

        })
    };

    disconnect(socket) {
        socket.on('disconnect', () => {
           try {
               write.warn(`Disconnect: ${socket.info.username}`);
               this.connectedSockets.all.forEach((element, index, array) => {
                   if (element.info.username === socket.info.username) {
                       array.splice(index, 1);
                       if (element.handshake.query.im === 'admin') {
                           this.connectedSockets.admin = null;
                       }
                       else if (element.handshake.query.im === 'watcher') {
                           this.connectedSockets.watcher = null;
                       }
                       else if (element.handshake.query.im === 'oddsWatcher') {
                           this.connectedSockets.oddsWatcher = null
                       }
                       else if (socket.handshake.query.im === 'player') {
                           this.connectedSockets.players.forEach((element, index, array) => {
                               if (element.info.username === socket.info.username) {
                                   array.splice(index, 1);
                               }
                           })
                           this.players.forEach((element, index, array) => {
                               if (element.username === socket.info.username) {
                                   array.splice(index, 1);
                               }
                           })
                           this.connectedSockets.admin.emit('players_sync', this.players);
                       }

                   }
               });
           } catch (e) {
               write.error(e)
           }
        })
    }

    matchListFromWatcher(socket) {
        write.log('MATCH LIST LISTENER');
        socket.on('match_list_from_watcher', data => {
            //init
            if (!this.match_list) this.match_list = data;
            // проверка на разницу количества матчей
            else if (this.match_list.length !== data.length) {
                this.match_list = data;
                if (this.connectedSockets.admin) this.connectedSockets.admin.emit('import_matches', this.match_list)
            }
            // проверка на совпадение статуса
            this.match_list.forEach((elem, index, array) => {
                if (array[index].STATUS !== data[index].STATUS) {
                    this.match_list = data
                    if (this.connectedSockets.admin) this.connectedSockets.admin.emit('import_matches', this.match_list)
                }
            })
        });
    }

    betsOdds(socket) {
        write.log('BETS ODDS LISTENER');
        socket.on('updatematch_dota', data => {
            let id = JSON.parse(data).id;
            try {
                if (this.match_list) {
                    this.match_list.forEach(match => {
                        if (match.LIVE_DATA_IDS) {
                            if (match.LIVE_DATA_IDS.includes(id.toString())) {
                                if (this.connectedSockets.admin) {
                                    this.connectedSockets.admin.emit(`${match.DATA_ID}`, data)
                                }
                            }
                        }
                    })
                }
            } catch (e) {
                console.log(e)
            }
        });
    }

    liveScoreListener() {
        liveScoreWorker()
            .then(result => {
                if (JSON.stringify(this.currentLiveScore) !== JSON.stringify(result)) {
                    this.currentLiveScore = result
                    if (this.connectedSockets.admin) this.connectedSockets.admin.emit('live_score_api', this.currentLiveScore.game_list);
                }
            }).then(() => {
            setTimeout(() => {
                this.liveScoreListener()
            }, 600)
        });
    };

    winnerListener(socket) {
        write.log('WINNER LISTENER');
        socket.on('check_winner', data => {
            console.log(data.match_id);
            da.getMatchDetails({match_id: data.match_id}).then(result => {
                if (result.result.match_id) {
                    this.connectedSockets.admin.emit(data.data_id, {
                        radiant_win: result.result.radiant_win
                    })
                } else {
                    console.log(result)
                }

            })
        });
    };

    test(socket) {

        socket.on('set_status', data => {
            console.log('SET STATUS')
            this.connectedSockets.players.forEach(elem => {
                if (elem.info.username === data.username) {
                    elem.emit('set_status', {
                        status: data.status
                    })
                }
            })
        })

        socket.on('test_move', () => {
            console.log('TEST MOVE')
            this.connectedSockets.players.forEach(elem => {
                elem.emit('test_move')
            })
        })

        socket.on('test_bet', () => {
            console.log('TEST BET')
            this.connectedSockets.players.forEach(elem => {
                elem.emit('test_bet');
            })
        })

        socket.on('enter-bets-site', () => {
            console.log('enter-bets-site')
            this.connectedSockets.players.forEach(elem => {
                elem.emit('enter-bets-site')
            })
        })

        socket.on('hello', data => {
            console.log('hello')
        })

        socket.on('all', () => {
            this.connectedSockets.all.forEach(elem => {
                console.log(elem.info)
            })
        })
        socket.on('players', () => {
            this.connectedSockets.players.forEach(elem => {
                console.log(elem.type);
                console.log(elem.username)
            })
        });
        socket.on('admin', () => {
            console.log(this.connectedSockets.admin.info)

        });
        socket.on('watcher', () => {
            console.log(this.connectedSockets.watcher.type)
            console.log(this.connectedSockets.watcher.username)
        });
        socket.on('players-array', () => {
            console.log(this.players)
        })
    }
};



