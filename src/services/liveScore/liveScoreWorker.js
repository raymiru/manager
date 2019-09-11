const buildingStateParser = require('./buildingStateParser');
const da = require('./steamApi');
const to = require('await-to-js').default;

module.exports = async () => {

    let newLiveScore = null;

    try {
        newLiveScore = await da.getTopLiveGame({partner: 2});
        if (newLiveScore && newLiveScore.game_list) {
            newLiveScore.game_list.forEach(match => {
                delete match.sort_score;
                delete match.spectators;
                match.building_state_string = match.building_state;
                match.building_state_change = buildingStateParser(match.building_state).exportData
                match.building_state = buildingStateParser(match.building_state).buildingState;
            });
            return newLiveScore
        }

    } catch (e) {
        console.error(e)
    }
};
