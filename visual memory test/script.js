let buttons = document.getElementsByClassName("btn")
let logger = document.getElementById("logger")
let tracker = document.getElementById("tracker")
let livetracker = document.getElementById("livetracker")
let grid = document.getElementById("maingrid")


let lives = 3
let generatedTiles = []
let selectedTiles = []
let points = 0;

let gridsize = 16;

function addevents() {
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i]
        button.addEventListener("click", function () {

            if (!button.classList.contains("disabled") && !button.classList.contains("showed")) {
                if (!generatedTiles.includes(i) && !button.classList.contains("correctSquare")) {
                    if (!button.classList.contains("wrongSquare")) {
                        button.classList.add("wrongSquare")
                        lives--;
                        if (lives <= 0) {
                            reset();
                        }
                        livetracker.textContent = "lives: " + lives;
                    }

                }
                else {
                    button.classList.add("correctSquare")

                    for (var j = 0; j < generatedTiles.length; j++) {

                        if (generatedTiles[j] == i) {

                            generatedTiles.splice(j, 1);
                        }

                    }

                }

                if (generatedTiles.length == 0) {
                    nextlevel()

                }
            }

        })
    }
}

for (let i = gridsize; i < 36; i++) {
    buttons[i].classList.add("hidden")
}

generateTiles()

hideTiles()

addevents()

function nextlevel() {

    //buttons = document.getElementsByClassName("btn")

    points++;


    if (points == 3) {
        grid.style.width = "500px";

        for (let i = gridsize; i < 25; i++) {
            buttons[i].classList.remove("hidden")
        }
        gridsize = 25;

    }
    else
        if (points == 6) {
            grid.style.width = "600px";

            for (let i = gridsize; i < 36; i++) {
                buttons[i].classList.remove("hidden")
            }
            gridsize = 36;

        }
    tracker.textContent = "points: " + points;

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("wrongSquare")
        buttons[i].classList.remove("correctSquare")
        var clonebutton = buttons[i].cloneNode(true)
        buttons[i] = clonebutton
    }


    generateTiles()

    hideTiles()



}

function reset() {

    lives = 3
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("wrongSquare")
        buttons[i].classList.remove("correctSquare")
        var clonebutton = buttons[i]
        buttons[i] = clonebutton
    }

    generateTiles()

    hideTiles()

    points = 0

    tracker.textContent = "points: " + points;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function hideTiles() {

    await sleep(2000)


    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("disabled")
    }

    for (let i = 0; i < generatedTiles.length; i++) {
        buttons[generatedTiles[i]].classList.remove("showed")
    }

}

function generateTiles() {


    generatedTiles = [];
    for (let i = 0; i < gridsize; i++) {
        let x = parseInt((Math.random() * 4), 10)
        if (x == 1) {
            generatedTiles.push(i)

        }
    }

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add("disabled")
    }
    for (let i = 0; i < generatedTiles.length; i++) {
        buttons[generatedTiles[i]].classList.add("showed")
    }
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index])
}

// show tiles to click
// hide tiles
// press tiles

// while not over
// correct: show green
// wrong: show red lives--