const to = require('await-to-js').default;
const mongoose = require('mongoose');
const Player = mongoose.model('Player');

module.exports = async (steam_username) => {
    let err, data;

    const player = new Player({
        steam:{
            username: steam_username
        }
    });

    if (await player.checkReg()) {
        console.log('TRUE')
    } else {
        console.log('FALSE');
        [err, data] = await to(player.save());
        if (err) throw err
        console.log(data)
    }
};
