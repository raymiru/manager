const to = require('await-to-js').default;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    steam: {
        username: String,
        password: String
    },
    bank: Number,
    deposit: Number,
    created: Date,
    email: {
        address: String,
        password: String
    },
});

PlayerSchema.methods.checkReg = async function () {
    let err, data;

    [err, data] = await to(this.model('Player').find({'steam.username': {$eq: this.steam.username}}));
    if (err) throw err;
    return data.length;
};

mongoose.model('Player', PlayerSchema);
