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
            watcher: {
                DOTA2: null,
                CSGO: null
            },
            oddsWatcher: {
                DOTA2: null,
                CSGO: null
            },
            players: []
        };
        this.match_list = {
            DOTA2: {
                now: null,
                next: null
            },
            CSGO: {
                now: null,
                next: null
            }
        };

        this.live_status = {
            DOTA2: [],
            CSGO: []
        };
        this.players = [];
        this.currentLiveScore = {}
    }

    auth(socket) {
        write.log('AUTH LISTENER');

        const socketSave = data => {
            socket.emit('auth', {auth: 'success'});
            socket.info = data;
            this.connectedSockets.all.push(socket);
            if (socket.handshake.query.im === 'player') {
                this.connectedSockets.players.push(socket);
                this.players.push(data);
                if (this.connectedSockets.admin) {
                    this.connectedSockets.admin.emit('players_sync', this.players)
                    this.connectedSockets.admin.emit('notification', {
                        event: 'player_connect',
                        username: data.username
                    })
                }
                ;
            } else if (socket.handshake.query.im === 'admin') {
                this.connectedSockets.admin = socket
                this.connectedSockets.admin.emit('import_matches_dota2_now', this.match_list.DOTA2.now);
                this.connectedSockets.admin.emit('import_matches_dota2_next', this.match_list.DOTA2.next);
                this.connectedSockets.admin.emit('import_matches_csgo_now', this.match_list.CSGO.now);
                this.connectedSockets.admin.emit('import_matches_csgo_next', this.match_list.CSGO.next);
                this.connectedSockets.admin.emit('players_sync', this.players);
                this.connectedSockets.admin.emit('live_score_api', this.currentLiveScore.game_list);
                // отправить стартовыне данные

            } else if (socket.handshake.query.im === 'watcher') {
                if (socket.handshake.query.game === 'dota2') {
                    console.log('WATCHER DOTA2 SAVE')
                    this.connectedSockets.watcher.DOTA2 = socket
                } else if (socket.handshake.query.game === 'csgo') {
                    console.log('WATCHER CSGO SAVE')
                    this.connectedSockets.watcher.CSGO = socket
                }
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
        try {
            write.log('PLAYER SYNC LISTENER');
            socket.on('players_sync', data => {
                console.log('PLAYERS SYNC');
                this.players.forEach((elem, index, array) => {
                    if (elem.username === socket.info.username) {
                        write.info('CHANGE');
                        array[index] = data
                    }
                });
                if (this.connectedSockets.admin) this.connectedSockets.admin.emit('players_sync', this.players);

            })

            socket.on('bet_error', data => {
                console.log(data);
                if (this.connectedSockets.admin) this.connectedSockets.admin.emit('bet_error', data)
            })
        } catch (e) {
            console.error(e)
        }
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
                        } else if (element.handshake.query.im === 'watcher') {
                            if (element.handshake.query.game === 'dota2') {
                                this.connectedSockets.watcher.DOTA2 = null;
                            } else if (element.handshake.query.game === 'csgo') {
                                this.connectedSockets.watcher.CSGO = null
                            }

                        } else if (element.handshake.query.im === 'oddsWatcher') {
                            if (element.handshake.query.game === 'dota2') {
                                this.connectedSockets.oddsWatcher.DOTA2 = null;
                            } else if (element.handshake.query.game === 'csgo') {
                                this.connectedSockets.oddsWatcher.CSGO = null
                            }

                        } else if (socket.handshake.query.im === 'player') {
                            this.connectedSockets.players.forEach((element, index, array) => {
                                if (element.info.username === socket.info.username) {
                                    this.connectedSockets.admin.emit('notification', {
                                        username: element.info.username,
                                        event: 'player_disconnect'
                                    });
                                    array.splice(index, 1);
                                }
                            });
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

    chatListener(socket) {
        write.log('CHAT LISTENER')
        socket.on('chat', data => {
            if (socket.handshake.query.game === 'dota2') {
                if (this.connectedSockets.admin) this.connectedSockets.admin.emit('import_chat_dota2', data)
            } else if (socket.handshake.query.game === 'csgo') {
                if (this.connectedSockets.admin) this.connectedSockets.admin.emit('import_chat_csgo', data)
            }
        })
    }


    liveStatusCompare(game, current, last) {
        console.log('COMPARE')
        current.forEach(currentElem => {
            last.forEach(lastElem => {

                if (lastElem.DATA_ID === currentElem.DATA_ID) {
                    console.log('COMPARE NOW')
                    if (lastElem.STATUS === null && currentElem.STATUS === 'live') {
                        console.log('YES')
                        this.connectedSockets.players.forEach(elem => {
                            elem.emit('live_status_update', game)
                        })

                    } else {
                        console.log('NOT')
                    }
                }
            })
        })
    }

    matchListFromWatcher(socket) {
        write.log('MATCH LIST LISTENER')
        socket.on('match_list_now', data => {

            if (socket.handshake.query.game === 'dota2') {
                console.log('dota2 match change');
                this.liveStatusCompare('dota2', data, this.live_status.DOTA2);
                this.live_status.DOTA2 = data
                this.match_list.DOTA2.now = data;
                if (this.connectedSockets.admin) this.connectedSockets.admin.emit('import_matches_dota2_now', this.match_list.DOTA2.now)
            } else if (socket.handshake.query.game === 'csgo') {
                console.log('csgo match change');
                this.liveStatusCompare('csgo', data, this.live_status.CSGO);
                this.live_status.CSGO = data;
                this.match_list.CSGO.now = data;
                if (this.connectedSockets.admin) this.connectedSockets.admin.emit('import_matches_csgo_now', this.match_list.CSGO.now)
            }
        })
        socket.on('match_list_next', data => {

            if (socket.handshake.query.game === 'dota2') {
                this.match_list.DOTA2.next = data;
                if (this.connectedSockets.admin) this.connectedSockets.admin.emit('import_matches_dota2_next', this.match_list.DOTA2.next)
            } else if (socket.handshake.query.game === 'csgo') {
                this.match_list.CSGO.next = data;
                if (this.connectedSockets.admin) this.connectedSockets.admin.emit('import_matches_csgo_next', this.match_list.CSGO.next)
            }
        })
    }


    betsOdds(socket) {
        write.log('DOTA2 BETS ODDS LISTENER');
        socket.on('updatematch_dota', data => {
            if (socket.handshake.query.game === 'dota2') {
                let id = JSON.parse(data).id;
                try {
                    if (this.match_list.DOTA2.now) {
                        this.match_list.DOTA2.now.forEach(match => {
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
            } else if (socket.handshake.query.game === 'csgo') {
                let id = JSON.parse(data).id;
                try {
                    if (this.match_list.CSGO.now) {
                        this.match_list.CSGO.now.forEach(match => {
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
            }
        });
    }

    liveScoreListener() {
        liveScoreWorker()
            .then(result => {
                if (JSON.stringify(this.currentLiveScore) !== JSON.stringify(result)) {
                    this.currentLiveScore = result
                    console.log('live_score_api_to_admin')
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

    adminListener(socket) {
        socket.on('all_players_to_ready', () => {
            this.connectedSockets.players.forEach(player => {
                player.emit('all_players_to_ready')
            })
        })


        socket.on('players_sync_request', data => {
            this.connectedSockets.players.forEach(player => {
                player.emit('players_sync_request', data)
            })
        })


        socket.on('update_watcher', game => {
            console.log(game)
            try {
                if (game === 'dota2') {
                    this.connectedSockets.watcher.DOTA2.emit('update_watcher')
                } else if (game === 'csgo') {
                    this.connectedSockets.watcher.CSGO.emit('update_watcher')
                }
            } catch (e) {
                console.error(e)
            }
        })


        socket.on('multi_bet_dota2', data => {
            console.log(data)
            data.betArr.forEach(player => {
                this.connectedSockets.players.forEach(sock => {
                    if (player.player === sock.info.username) {
                        sock.emit('single_bet', {
                            dataId: data.dataId,
                            statusBuilder: data.statusBuilder,
                            winSide: data.winSide,
                            betSize: player.bet
                        })
                    }
                })
            })

        })


        socket.on('data_ids_change', () => {
            this.connectedSockets.players.forEach(elem => {
                elem.emit('data_ids_change')
            })
        })


        socket.on('chat_control', data => {
            console.log('CHAT CONTROL')
            console.log(data)
            this.connectedSockets.players.forEach(elem => {
                if (elem.info.username === data.username) {
                    elem.emit('chat_control', data)
                }
            })
        });


        socket.on('chat_msg', data => {
            console.log('CHAT MSG');
            console.log(data)
            this.connectedSockets.players.forEach(elem => {
                if (elem.info.username === data.username) {
                    elem.emit('chat_msg', data)
                }
            })
        });


        socket.on('single_bet', data => {
            console.log('SINGLE BET');
            console.log(data);
            this.connectedSockets.players.forEach(elem => {
                if (elem.info.username === data.username) {
                    elem.emit('single_bet', data)
                }
            })
        })

        socket.on('place_bet_next', data => {
            console.log('PLACE BET NEXT')
            console.log(data);
            this.connectedSockets.players.forEach(elem => {
                if (elem.info.username === data.username) {
                    elem.emit('place_bet_next', data)
                }
            })

        });

        socket.on('place_rebet_next', data => {
            console.log('PLACE REBET NEXT')
            console.log(data);
            this.connectedSockets.players.forEach(elem => {
                if (elem.info.username === data.username) {
                    elem.emit('place_rebet_next', data)
                }
            })

        });

        socket.on('cancel_bet_next', data => {
            console.log('CANCEL BET NEXT');
            console.log(data)
            this.connectedSockets.players.forEach(elem => {
                if (elem.info.username === data.username) {
                    elem.emit('cancel_bet_next', data)
                }
            })
        });


        socket.on('place_bet', data => {
            console.log('PLACE BET')
            console.log(data)
            this.connectedSockets.players.forEach(elem => {
                if (elem.info.username === data.username) {
                    elem.emit('place_bet', data)
                }
            })
        });

        socket.on('place_bet_fast', data => {
            console.log('PLACE BET FAST')
            console.log(data);
            this.connectedSockets.players.forEach(elem => {
                if (elem.info.username === data.username) {
                    elem.emit('place_bet_fast', data)
                }
            })
        });

        socket.on('set_status', data => {
            console.log('SET STATUS')
            this.connectedSockets.players.forEach(elem => {
                if (elem.info.username === data.username) {
                    elem.emit('set_status', {
                        status: data.status
                    })
                }
            })
        });

        socket.on('set_game', data => {
            console.log('SET GAME')
            this.connectedSockets.players.forEach(elem => {
                if (elem.info.username === data.username) {
                    elem.emit('set_game', {
                        game: data.game
                    })
                }
            })
        });

        socket.on('test_move', () => {
            console.log('TEST MOVE')
            this.connectedSockets.players.forEach(elem => {
                elem.emit('test_move')
            })
        });

        socket.on('test_bet', () => {
            console.log('TEST BET')
            this.connectedSockets.players.forEach(elem => {
                elem.emit('test_bet');
            })
        });

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
            console.log(this.connectedSockets.watcher.CSGO.info)
        });
        socket.on('players-array', () => {
            console.log(this.players)
        })
    }
};



