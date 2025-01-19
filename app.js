const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")
let currentJellyfishIndex = 31 /*dbl chk, hard code*/
const width = 9
const turtlesRemoved = []
let turtlesId
let isGoingRight = true
let direction = -1
let results = 0
let pressedTime = null
let counter = 0

for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div")
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll(".grid div"))

function getRandomTurtlePosition() {
    return Math.floor(Math.random() * width) * width - 2; //hardcode 1
}

let turtleEnemies = []
turtleEnemies.push(getRandomTurtlePosition())

function spawnTurtle() {
    
    const randomDelay = Math.floor(Math.random() * 1500) + 500;
    
    setTimeout(() => {
        let newTurtlePos;
        do {
            newTurtlePos = getRandomTurtlePosition();
        } while (turtleEnemies.includes(newTurtlePos)); 

        turtleEnemies.push(newTurtlePos);  
        squares[newTurtlePos].classList.add("turtle");  
        spawnTurtle();
    }, randomDelay);
}

spawnTurtle();

function draw() {
    for (let i = 0; i < turtleEnemies.length; i++) {
        if (!turtlesRemoved.includes(i)) {
            squares[turtleEnemies[i]].classList.add("turtle")
        }
    }
}

draw()

squares[currentJellyfishIndex].classList.add("jellyfish")

function remove() {
    for (let i = 0; i < turtleEnemies.length; i++) {
        squares[turtleEnemies[i]].classList.remove("turtle")
    }
}

function moveJellyfish(e) {
    squares[currentJellyfishIndex].classList.remove("jellyfish")
    switch (e.key) {
        case "h":
            if (currentJellyfishIndex % width !== 0) currentJellyfishIndex -= 1
            break
        case "l":
            if (currentJellyfishIndex % width !== width - 1) currentJellyfishIndex += 1
            break
        case "j":
            if (currentJellyfishIndex + width < width * width) currentJellyfishIndex += (width) /*test*/
            break
        case "k":
            if (currentJellyfishIndex - width >= 0) currentJellyfishIndex -= (width) /*test*/
            break
    }
    squares[currentJellyfishIndex].classList.add("jellyfish")
}

document.addEventListener("keydown", moveJellyfish)

function moveTurtles() { /*test*/
    const leftEdge = turtleEnemies[0] % width === 0
    const rightEdge = turtleEnemies[turtleEnemies.length - 1] % width === width - 1
    remove()

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < turtleEnemies.length; i++) {
            turtleEnemies[i] -= width - 1
            direction = -1
            isGoingRight = false
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < turtleEnemies.length; i++) {
            turtleEnemies[i] -= width + 1
            direction = 1
            isGoingRight = true
        }
    }

    for (let i = 0; i < turtleEnemies.length; i++) {
        turtleEnemies[i] += direction
    }

    draw()

    if (squares[currentJellyfishIndex].classList.contains("turtle")) {
        resultDisplay.innerHTML = "GAME OVER"
        clearInterval(turtlesId)
    }

    if (currentJellyfishIndex > 56) {
        resultDisplay.innerHTML = "GAME OVER"
        clearInterval(turtlesId)
    }

    if (turtlesRemoved.length === turtleEnemies.length) {
        resultDisplay.innerHTML = "YOU WIN"
        clearInterval(turtlesId)
    }
}

turtlesId = setInterval(moveTurtles, 600)

function shoot(e) {
    let laserId
    let laserIdRight
    let currentLaserIndex = currentJellyfishIndex
    let currentLaserIndexRight = currentJellyfishIndex

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= 1

        if (currentLaserIndex % width === width - 1|| currentLaserIndex < 0){
            clearInterval(laserId);
            return;
        }

        squares[currentLaserIndex].classList.add("laser")

        if (squares[currentLaserIndex].classList.contains("turtle")) {
            squares[currentLaserIndex].classList.remove("laser")
            squares[currentLaserIndex].classList.remove("turtle")
            squares[currentLaserIndex].classList.add("boom")

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300)
            clearInterval(laserId)

            const turtleRemoved = turtleEnemies.indexOf(currentLaserIndex)
            turtlesRemoved.push(turtleRemoved)
            results++
            resultDisplay.innerHTML = results
        }
    }

    function moveLaser2() {
        squares[currentLaserIndexRight].classList.remove("laser")

        currentLaserIndexRight += 1

        if (currentLaserIndexRight % width === 0 && currentLaserIndexRight !== 0) {
            clearInterval(laserIdRight);
            return;
        }

        squares[currentLaserIndexRight].classList.add("laser")

        if (squares[currentLaserIndexRight].classList.contains("turtle")) {
            squares[currentLaserIndexRight].classList.remove("laser")
            squares[currentLaserIndexRight].classList.remove("turtle")
            squares[currentLaserIndexRight].classList.add("boom")

            setTimeout(() => squares[currentLaserIndexRight].classList.remove("boom"), 300)
            clearInterval(laserIdRight)

            const turtleRemoved = turtleEnemies.indexOf(currentLaserIndexRight)
            turtlesRemoved.push(turtleRemoved)
            results++
            resultDisplay.innerHTML = results
        }
    }


    if (e.key === "d") {
        if (counter === 0) {
            counter = 1
            pressedTime = Date.now()
        } else if (counter === 1 && Date.now() - pressedTime < 1000) {
            laserId = setInterval(moveLaser, 100)
            laserIdRight = setInterval(moveLaser2, 100)
        } else {
            counter = 0
            pressedTime = Date.now()
        }
    }
}

document.addEventListener('keydown', shoot)
