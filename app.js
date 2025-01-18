const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")
let currentJellyfishIndex = 202
const width = 15
const turtlesRemoved = []
let turtlesId
let isGoingRight = true
let direction = 1
let results = 0

for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div")
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll(".grid div"))
// test msg


const turtleEnemies = [
    0, 
    15, 
    30
]

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
            if (currentJellyfishIndex % width < width - 1) currentJellyfishIndex += 1
            break
        case "j":
            if (currentJellyfishIndex + width < width * width) currentJellyfishIndex += (width + 1)
            break
        case "k":
            if (currentJellyfishIndex - width >= 0) currentJellyfishIndex -= (width + 1)
            break
    }
    squares[currentJellyfishIndex].classList.add("jellyfish")
}

document.addEventListener("keydown", moveJellyfish)

function moveTurtles() {
    const leftEdge = turtleEnemies[0] % width === 0
    const rightEdge = turtleEnemies[turtleEnemies.length - 1] % width === width - 1
    remove()

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < turtleEnemies.length; i++) {
            turtleEnemies[i] += width + 1
            direction = -1
            isGoingRight = false
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < turtleEnemies.length; i++) {
            turtleEnemies[i] += width - 1
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

    if (turtlesRemoved.length === turtleEnemies.length) {
        resultDisplay.innerHTML = "YOU WIN"
        clearInterval(turtlesId)
    }
}

turtlesId = setInterval(moveTurtles, 600)

function shoot(e) {
    let laserId
    let currentLaserIndex = currentJellyfishIndex

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= width
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

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keydown', shoot)