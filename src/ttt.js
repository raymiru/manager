let work = true;
let intervalID;


intervalID = setInterval(() => {
    if (work) {
        console.log('SOME WORK')
    } else clearInterval(intervalID)
}, 1500)


setTimeout(() => {
    work = false
}, 8900)

