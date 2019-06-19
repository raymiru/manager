const mongoose = require('mongoose');




module.exports = async () => {
    console.log(mongoose.connection);
    await mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
    console.log(mongoose.connection)
};

