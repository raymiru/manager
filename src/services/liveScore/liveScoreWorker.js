const buildingStateParser = require('./buildingStateParser');
const da = require('./steamApi');
const to = require('await-to-js').default;

module.exports = async () => {

    let err, newLiveScore;

    [err, newLiveScore] = await to(da.getTopLiveGame({partner: 3}));
    if (err) console.log(err);

    if (newLiveScore.game_list) {
            newLiveScore.game_list.forEach(match => {
                delete match.sort_score;
                delete match.spectators;
                match.building_state_string = match.building_state;
                match.building_state = buildingStateParser(match.building_state);
            })
        }
    return newLiveScore
};
