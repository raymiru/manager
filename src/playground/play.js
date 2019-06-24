const axios = require('axios').default;

const playerFilter = require('../services/liveScore/playersFilter');

playerFilter(4861375256).then(result => {
    console.log(result)
});
// let match_id = 4861345554
//
// axios.get(`https://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v1/?key=4DA49E795D91371C6C5226728380F221&match_id=${match_id}`).then(result => {
//     console.log(result.data.result.games)
// })
