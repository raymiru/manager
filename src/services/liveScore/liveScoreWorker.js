const buildingStateParser = require('./buildingStateParser');
const playersFilter = require('./playersFilter');
const da = require('./steamApi');

module.exports = async currentLiveScore => {
    try {
        const newLiveScore = await da.getTopLiveGame({partner: 2});
        if (newLiveScore.game_list) {
            newLiveScore.game_list.forEach(async match => {
                delete match.sort_score;
                delete match.spectators;
                match.building_state_string = match.building_state;
                match.building_state = buildingStateParser(match.building_state);
                match.players = await playersFilter(match.players, match.team_id_radiant, match.team_id_dire);
            });
        }
        return newLiveScore.game_list
    } catch (e) {
        console.log(e)
    }
};

//
// module.exports = matches => {
//     matches.game_list.forEach(elem => {
//         elem.building_state_string = elem.building_state
//         elem.building_state = buildingStateParser(elem.building_state)
//         elem.players.forEach(elem => {
//             heroes.forEach(item => {
//                 if (elem.hero_id === item.id) {
//                     elem.imgSrc = item.imgSrc
//                 }
//             })
//         })
//
//     });
//     return matches.game_list
// };
