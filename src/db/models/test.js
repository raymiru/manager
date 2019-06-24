// const mongoose = require('mongoose');
// const to = require('../../../utilities/to');
// const playerSchema = require('../schemas/player');
//
// const Player = mongoose.model('Player', playerSchema);



// module.exports = async () => {
//     let err, data;
//
//
//     const checkReg = async () => {
//         console.log('checkReg: ');
//     };
//
//     const player = new Player({
//         steam_username: 'player1'
//     });
//
//     [err, data] = await to(Player.find({steam_username: {$eq: 'player1'}}));
//     if (err) console.log(err);
//
//     if (data.length === 0) {
//         [err, data] = await to(player.save())
//         if (err) throw err;
//         return {
//             type: 'success',
//             message: data
//         }
//     } else {
//         return {
//             type: 'error',
//             message: 'User have been registered'
//         }
//     }
//
//
//
//
//
//
// };
