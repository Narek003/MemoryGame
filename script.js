let arr = [
    ['Kuala', './images/Koala.jpg'], 
    ['Lion','./images/lion.jpg'],
    ['Panda','./images/panda.jpg'], 
    ['Rabbit', './images/rabbit.jpg'], 
    ['Tiger', './images/Tiger.png'], 
    ['Wolf', './images/wolf.jpg']
]
const game = document.createElement('div')
game.className = 'game'
const chooseDiv = document.querySelector('.chooseDiv')
let time
let items
let cartCount
let difficulty
let timerDiv = document.createElement('div')
let interval

function timer(){
    if(difficulty == 2){
        time = 30
    }else{
        time = 40
    }
    timerDiv.className = 'timer'
    timerDiv.innerHTML = `<h3>${time}s</h3>`
    document.body.append(timerDiv)
    interval = setInterval(() => {
        time--
        timerDiv.innerHTML = `<h3>${time}S</h3>`
        if(time == 0) gameOver()
    }, 1000);
}

function checkDif(value){
    if(value == 'easy'){
        difficulty = 2
    }else{
        difficulty = 4
    }
    cartCount = difficulty * arr.length
    chooseDiv.remove()
    startGame()
    timer()
}

function startGame(){
    let set = new Set()
    while(set.size < arr.length * difficulty){
        set.add(Math.floor(Math.random() * arr.length * difficulty))
    }
    let randomIndx = Array.from(set)
    makeItems(arr, 0, randomIndx)
    makeCarts(items)
}

function makeItems(array, num, randomIndx){
    items = []
    while(num < randomIndx.length){
        if(num >= array.length){
            let x = num - array.length
            while(x >= array.length){
                x -= array.length
            }
            items[randomIndx[num]] = {name:array[x][0], img:array[x][1], id:randomIndx[num]}
        }else{
            items[randomIndx[num]] = {name:array[num][0],img:array[num][1], id:randomIndx[num]}
        }
        num++
    }
}

function makeCarts(array){
    let flBasis
    let gameWidth
    if(difficulty == 4){
        flBasis = '12%'
        gameWidth = '1200px'
    }else 
    if(difficulty == 2){
        flBasis = '22%'
        gameWidth = '800px'
    }
    game.style.width = gameWidth
    let checkArr = []
    let eventsArr = []
    game.innerHTML = ''
    array.forEach((obj, indx) => {
        let cart = document.createElement('div')
        let front = document.createElement('div')
        let back = document.createElement('div')
        back.className = 'back'
        front.className = 'front'
        back.id =  `back${indx}`
        front.id = `front${indx}`
        back.style.backgroundImage = `url(${obj.img})`
        cart.className = `cart`
        cart.style.flexBasis = flBasis
        cart.id = `cart${indx}`
        cart.addEventListener('click', ev => {
            if(ev.target.id !== `back${indx}` && ev.target.className !== `cart`){
                let backId = 'back' + ev.target.id.split('front')[1]
                let thisCartBack = document.getElementById(backId)
                    ev.target.style.transform = "rotateY(180deg)";
                    thisCartBack.style.transform = "rotateY(360deg)";
                    if(checkArr.length < 2){
                        eventsArr.push([ev.target, thisCartBack])
                        checkArr.push([obj, indx])
                    }else{
                        checkArr = [[obj, indx]]
                        eventsArr = [[ev.target, thisCartBack]]
                    }
                    if(checkArr.length == 2)checkCarts(checkArr, eventsArr)
                    if(cartCount == 0)Win()
            }
        })
        cart.append(front,back)
        game.append(cart)
        document.body.append(game)
    })
}

function checkCarts(arrList, eventList){
    if(arrList[0][0].name == arrList[1][0].name){
        setTimeout(() => {
            document.getElementById(`cart${arrList[0][1]}`).style.transform = 'scale(0)'
            document.getElementById(`cart${arrList[1][1]}`).style.transform = 'scale(0)'
        },1000)
        cartCount -= 2
    }else{
        setTimeout(() => {
            eventList[0][0].style.transform = "rotateY(0)";
            eventList[0][1].style.transform = "rotateY(180deg)";
            eventList[1][0].style.transform = "rotateY(0)";
            eventList[1][1].style.transform = "rotateY(180deg)";
            arrList = []
            eventList = []
        },800)
    }
}

function Win(){
    clearInterval(interval)
    const win = document.createElement('div')
    win.className = 'win'
    timerDiv.remove()
    win.style.width = game.style.width
    let winText = document.createElement('h1')
    winText.append('YOU WIN')
    win.append(winText)
    game.append(win)         
    setTimeout(() => {
        win.remove()
        game.remove()
        document.body.append(chooseDiv)
    },1500)
}

function gameOver(){
    clearInterval(interval)
    let backDiv = document.createElement('div')
    backDiv.className = 'backDiv'
    const lose = document.createElement('div')
    lose.className = 'lose'
    lose.style.width = game.style.width
    let loseText = document.createElement('h1')
    loseText.append('YOU LOST')
    lose.append(loseText)
    timerDiv.remove()
    backDiv.append(lose)
    game.append(backDiv)
    setTimeout(() => {
        lose.remove()
        game.remove()
        document.body.append(chooseDiv)
    },1500)
}