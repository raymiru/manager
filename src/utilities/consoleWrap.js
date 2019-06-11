const colors = require('colors');

const nothing = () => {
    return null
};


module.exports = (mode) => {

    if (mode === 0) {
        return {
            log: nothing,
            error: nothing,
            warn: nothing,
            info: nothing,
        }
    }
    else if (mode === 1) {
        return {
            log: nothing,
            error: (msg) => {
                if (typeof msg === "object") {
                    console.error('Error:'.bgRed);
                    for (let key in msg) {
                        console.error(`${key}: ${msg[key].red}`);
                    }
                } else {
                    console.error('Error!'.bgRed + ' ' + `${msg}`.red)
                }
            },
            warn: nothing,
            info: (msg) => {
                if (typeof msg === "object") {
                    console.info('Info:'.bgGreen);
                    for (let key in msg) {
                        console.info(`${key}: ${msg[key].green}`);
                    }
                } else {
                    console.info('Info!'.bgGreen + ' ' `${msg}`.green)
                }
            }
        }
    }
    else if (mode === 2) {
        return {

            log: (msg) => {
                if (typeof msg === "object") {
                    console.log('Log:'.bgBlue);
                    for (let key in msg) {
                        console.log(`${key}: ` + `${msg[key]}`.blue);
                    }
                } else {
                    console.log('Log:'.bgBlue + ' ' + `${msg}`.blue)
                }
            },
            error: (msg) => {
                if (typeof msg === "object") {
                    console.error('Error:'.bgRed);
                    for (let key in msg) {
                        console.error(`${key}: ` + `${msg[key]}`.red);
                    }
                } else {
                    console.error('Error!'.bgRed + ' ' + `${msg}`.red)
                }
            },
            warn: (msg) => {
                if (typeof msg === "object") {
                    console.warn('Warn:'.bgYellow);
                    for (let key in msg) {
                        console.warn(`${key}: ` + `${msg[key]}`.yellow);
                    }
                } else {
                    console.log('Warn!'.bgYellow + ' ' + `${msg}`.yellow)
                }
            },
            info: (msg) => {
                if (typeof msg === "object") {
                    console.info('Info:'.bgGreen);
                    for (let key in msg) {
                        console.info(`${key}: ` + `${msg[key]}`.green);
                    }
                } else {
                    console.info('Info!'.bgGreen + ' ' + `${msg}`.green)
                }
            }
        }
    }
};




