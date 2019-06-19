const get = (data) => {
    setTimeout(function () {
        console.log('Я хочу быть первым')
        last()
    }, 1000)


}
const last =  () => {
    console.log('Я хочу быть последним')
}

get()
