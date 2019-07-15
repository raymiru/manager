let i = 10;
const intervalID = setInterval(() => {
    i--
    console.log(i)
    if (i === 0) {

        clearInterval(intervalID)
    }
}, 1000)
