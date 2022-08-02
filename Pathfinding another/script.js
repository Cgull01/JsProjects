const container = document.querySelector('.container')
const DOMcells = document.querySelectorAll('td')
const title = document.querySelector('h1')
const logger = document.getElementById('logger')
// const StartButton = document.getElementById('startButton')

const rowCount = 28;
const collumnCount = 75;

var mouseIsDown;

var HoverStart = false;
var HoverTarget = false;

var Cells = []


var HoverX
var HoverY

document.addEventListener("mousedown", () => {
    mouseIsDown = true;
})
document.addEventListener("mouseup", () => {
    mouseIsDown = false;
    HoverStart = false;
    HoverTarget = false;

})

// startButton.addEventListener('click', () => {
//     draw();
// })

let x = 0;
for (let i = 0; i < rowCount; i++) {
    let arr = []
    for (let j = 0; j < collumnCount; j++) {

        let cell = DOMcells[x];

        arr.push(cell)

        x++;
    }
    Cells.push(arr)
}

for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < collumnCount; j++) {
        cell = Cells[i][j]
        cell.addEventListener("mousemove", () => {

            HoverX = i;
            HoverY = j;

            // if mouse hovers on start cell
            if (HoverX == start.j && HoverY == start.i && mouseIsDown == true) {
                HoverStart = true;
            }

            // if mouse hovers on target cell
            else if (HoverX == end.j && HoverY == end.i && mouseIsDown == true) {
                HoverTarget = true;
            }

            if (mouseIsDown) {

                // if mousedown on anything else than start, draw wall
                if (HoverStart == false && HoverTarget == false) {

                    grid[HoverY][HoverX].wall = true;
                    grid[HoverY][HoverX].show('wall');
                    draw();
                }

                // if mousedown on start cell, change start position
                if (HoverStart == true) {

                    grid[HoverY][HoverX].wall = false;
                    grid[HoverY][HoverX].hide('wall');

                    start.cell.classList.remove('start');
                    start = grid[HoverY][HoverX]
                    start.cell.classList.add('start');
                    draw();

                }
                else
                    if (HoverTarget == true) {
                        grid[HoverY][HoverX].wall = false;
                        grid[HoverY][HoverX].hide('wall');

                        end.cell.classList.remove('end');
                        end = grid[HoverY][HoverX]
                        end.cell.classList.add('end');
                        draw();

                    }
            }
            log();

        })

    }
}

function log() {
    logger.innerHTML = '';
    logger.innerHTML += HoverStart + ' ' + HoverTarget + "<br>";
    logger.innerHTML += start.cell.id + ' ' + start.i + ' ' + start.j + "<br>";
    logger.innerHTML += end.cell.id + ' ' + end.i + ' ' + end.j + "<br>";
    logger.innerHTML += `${HoverX} ${HoverY}` + "<br>";

}