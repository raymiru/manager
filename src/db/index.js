const mongoose = require('mongoose');
const to = require('../utilities/to');
require('./models/Player');

const write = require('../utilities/consoleWrap')(2);


module.exports = async () => {
    let err, connect;

    [err, connect] = await to(mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true}))
    if (err) throw err;
    write.info('Connected to DB');
};

