const buildingCost = {
    team1: {
        top: 1,
        mid: 8,
        bot: 64,
        t4: 800
    },
    team2: {
        top: 65536,
        mid: 524288,
        bot: 4194304,
        t4: 0
    }
};

//12191524
//12191524

const startValue = 4784201;


const buildingStateParser = (value) => {
    if (value === 19138340) {
        return {
            "team1": {
                "top": "11111",
                "mid": "11111",
                "bot": "11111",
                "t4": "11"
            },
            "team2": {
                "top": "11111",
                "mid": "11111",
                "bot": "11111",
                "t4": "11"
            }
        }

    }

    let changedValue = value - startValue;


    let buildingState = {
        team1: {
            "top": [],
            "mid": [],
            "bot": [],
            "t4": []
        },

        team2: {
            "top": [],
            "mid": [],
            "bot": [],
            "t4": []
        }
    }

    while (changedValue !== 0 ) {

        // team2 bot
        if (changedValue >= buildingCost.team2.bot) {

            changedValue -= buildingCost.team2.bot;

            buildingState.team2.bot.push(0)
        }
        // team2 mid
        else if (changedValue >= buildingCost.team2.mid) {

            changedValue -= buildingCost.team2.mid;

            buildingState.team2.mid.push(0);

        }
        // team2 top
        else if (changedValue >= buildingCost.team2.top) {

            changedValue -= buildingCost.team2.top;
            buildingState.team2.top.push(0);

        }

        //team1 t4
        else if (changedValue >= buildingCost.team1.t4) {
            changedValue -= buildingCost.team1.t4;
            buildingState.team1.t4.push(0)
        }

        //team1 bot
        else if (changedValue >= buildingCost.team1.bot) {

            changedValue -= buildingCost.team1.bot;
            buildingState.team1.bot.push(0);

        }
        //team1 mid
        else if (changedValue >= buildingCost.team1.mid) {

            changedValue -= buildingCost.team1.mid;
            buildingState.team1.mid.push(0)

        }
        //team1 top
        else if (changedValue >= buildingCost.team1.top) {

            changedValue -= buildingCost.team1.top;
            buildingState.team1.top.push(0)

        }
        else changedValue = 0
    }

    for (let side in buildingState) {
        for (let item in buildingState[side]) {
            if (item !== 't4') {
                if (buildingState[side][item].length < 5) {
                    for (let i = buildingState[side][item].length; i < 5; i++) {
                        buildingState[side][item].push(1);
                    }
                }
            }
            if (item === 't4') {
                for (let i = buildingState[side][item].length; i < 2; i++) {
                    buildingState[side][item].push(1);
                }
            }
            buildingState[side][item] = buildingState[side][item].join('')
        }
    }

    return buildingState
};

module.exports = buildingStateParser;
