const buildingCost = {
    team1: {
        top: 1,
        mid: 8,
        bot: 64,
        t4: 512
    },
    team2: {
        top: 65536,
        mid: 524288,
        bot: 4194304,
        t4: 768
    }
};
const startValue = 4784201;
console.log('DSDS')
let cc = 18810594 -  1 - 8 -8 -8 -8 -8 -64 -64 - 65536 - 65536 - 65536 - 65536 - 65536 - 524288 - 524288 - 4194304 - 4194304 - 4194304
let cb = cc - startValue
console.log(cc)
console.log(cb)

//29296571




const buildingStateParser = (value) => {
    if (value === 19138340) {
        return {
            buildingState: {
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
    }

    let changedValue = value - startValue;
    let exportData = {
        value,
        changedValue: changedValue,
        arrayOfChanges: []
    };


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
    };

    while (changedValue !== 0) {


        // team2 bot
        if (changedValue >= buildingCost.team2.bot) {

            changedValue -= buildingCost.team2.bot;

            exportData.arrayOfChanges.push({
                changedValue,
                changer: buildingCost.team2.bot,
                changerSymb: 'team2.bot'
            })

            if (buildingState.team2.bot.length < 5) {
                buildingState.team2.bot.push(0)
            }

        }
        // team2 mid
        else if (changedValue >= buildingCost.team2.mid) {

            changedValue -= buildingCost.team2.mid;

            exportData.arrayOfChanges.push({
                changedValue,
                changer: buildingCost.team2.mid,
                changerSymb: 'team2.mid'
            })

            if (buildingState.team2.mid.length < 5) {
                buildingState.team2.mid.push(0);
            }



        }
        // team2 top
        else if (changedValue >= buildingCost.team2.top) {

            changedValue -= buildingCost.team2.top;

            exportData.arrayOfChanges.push({
                changedValue,
                changer: buildingCost.team2.top,
                changerSymb: 'team2.top'
            })

            if (buildingState.team2.top.length < 5) {
                buildingState.team2.top.push(0);
            }


        }

        //team2 t4
        else if (changedValue >= buildingCost.team2.t4) {
            changedValue -= buildingCost.team2.t4;

            exportData.arrayOfChanges.push({
                changedValue,
                changer: buildingCost.team2.t4,
                changerSymb: 'team2.t4'
            })

            if (buildingState.team2.t4.length < 2) {
                buildingState.team2.t4.push(0)
            }

        }

        //team1 t4
        else if (changedValue >= buildingCost.team1.t4) {
            changedValue -= buildingCost.team1.t4;

            exportData.arrayOfChanges.push({
                changedValue,
                changer: buildingCost.team1.t4,
                changerSymb: 'team1.t4'
            })

            if (buildingState.team1.t4.length < 2) {
                buildingState.team1.t4.push(0)
            }

        }


        //team1 bot
        else if (changedValue >= buildingCost.team1.bot) {

            changedValue -= buildingCost.team1.bot;

            exportData.arrayOfChanges.push({
                changedValue,
                changer: buildingCost.team1.bot,
                changerSymb: 'team1.bot'
            })

            if (buildingState.team1.bot.length < 5) {
                buildingState.team1.bot.push(0);
            }


        }
        //team1 mid
        else if (changedValue >= buildingCost.team1.mid) {

            changedValue -= buildingCost.team1.mid;

            exportData.arrayOfChanges.push({
                changedValue,
                changer: buildingCost.team1.mid,
                changerSymb: 'team1.mid'
            })

            if (buildingState.team1.mid.length < 5)  {
                buildingState.team1.mid.push(0)
            }


        }
        //team1 top
        else if (changedValue >= buildingCost.team1.top) {

            changedValue -= buildingCost.team1.top;

            exportData.arrayOfChanges.push({
                changedValue,
                changer: buildingCost.team1.top,
                changerSymb: 'team1.top'
            })
            if (buildingState.team1.top.length < 5) {
                buildingState.team1.top.push(0)
            }


        }

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

    return {
        buildingState,
        exportData
    }

};

module.exports = buildingStateParser;
