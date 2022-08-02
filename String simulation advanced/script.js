const canvas = document.getElementById('game')
const logger = document.getElementById('logger')

const freezeButton = document.getElementById('freezeButton')
const resetbutton = document.getElementById('resetButton')
const gridButton = document.getElementById('gridButton')

gridButton.style.visibility = "hidden"

const connectionBool = document.getElementById('connectionBool')
const pointBool = document.getElementById('pointBool')


/// get computed style for image
var cs = getComputedStyle(canvas);

/// these will return dimensions in *pixel* regardless of what you originally specified for image:
var canvas_width = parseInt(cs.getPropertyValue('width'), 10);
var canvas_height = parseInt(cs.getPropertyValue('height'), 10);

const canvas_context = canvas.getContext('2d');

/// now use this as width and height for your canvas element:
canvas.width = canvas_width;
canvas.height = canvas_height;

class Point {
    constructor(PositionX, PositionY, prevPositionX, prevPositionY, locked) {
        this.PositionX = PositionX;
        this.PositionY = PositionY;

        this.prevPositionX = prevPositionX;
        this.prevPositionY = prevPositionY;

        this.locked = locked;
    }
}

class Stick {

    constructor(pointA, pointB, length) {
        this.pointA = pointA;
        this.pointB = pointB;

        this.length = length;
    }
}

var points = []
var sticks = []

// Number of iterations for stabilizing length of each string
var numIterations = 3;

// mouse position
var mouse_pos_X
var mouse_pos_Y

// checkboxes
var freezeSimulation = false
var allowMultipleConnections = false
var showPoints = false

var mouse_click_count = 0

var min_link_distance = 50
var max_connection_count = 2

// for cutting sticks
var inaccuracy_treshhold = 15

clearCanvas();
createGrid();
Simulate();

// function to instantly create interactable grid
function createGrid() {
    var CX = 130
    var CY = 130

    var height = 20
    var width = 70
    var space = 15

    for (let i = 1; i < height; i++) {
        for (let j = 1; j < width; j++) {

            let p1 = new Point(CX, CY, CX, CY, false)

            if(i == 1)
            p1.locked = true

            points.push(p1)

            CX += space

            if (points.length > 1 && j > 1)
                sticks.push(new Stick(p1, points[points.length - 2], space))

            if (i > 1) {
                sticks.push(new Stick(p1, points[points.length - width], space))
            }

        }
        CY += space
        CX = 130

    }



    draw()
}


function Simulate() {

    if (freezeSimulation == true) {
        return;
    }
    window.requestAnimationFrame(Simulate);

    for (let i = 0; i < points.length; i++) {
        const p = points[i];

        if(!p.locked){
            positionBeforeUpdateX = p.PositionX
            positionBeforeUpdateY = p.PositionY

            p.PositionX += p.PositionX - p.prevPositionX
            p.PositionY += p.PositionY - p.prevPositionY

            p.PositionY += 1//gravity

            p.prevPositionX = positionBeforeUpdateX
            p.prevPositionY = positionBeforeUpdateY

            if (p.PositionY >= 1500)
            {
                points.splice(i,1)
                i--;
            }
        }
    }


    for (let i = 0; i < numIterations; i++) {

        sticks.forEach(stick => {

            let stickCentreX = (stick.pointA.PositionX + stick.pointB.PositionX) / 2

            let stickCentreY = (stick.pointA.PositionY + stick.pointB.PositionY) / 2

            let stickDirX = (stick.pointA.PositionX - stick.pointB.PositionX)  // normalize
            let stickDirY = (stick.pointA.PositionY - stick.pointB.PositionY) // normalize

            let magnitude = Math.sqrt(stickDirX * stickDirX + stickDirY * stickDirY) // normalized

            stickDirX /= magnitude;
            stickDirY /= magnitude;

            if (stick.pointA.locked == false) {
                stick.pointA.PositionX = stickCentreX + stickDirX * stick.length / 2
                stick.pointA.PositionY = stickCentreY + stickDirY * stick.length / 2
            }

            if (stick.pointB.locked == false) {
                stick.pointB.PositionX = stickCentreX - stickDirX * stick.length / 2
                stick.pointB.PositionY = stickCentreY - stickDirY * stick.length / 2
            }
        });
    }

    draw()
}

function KeyPress(e) {
    //var evtobj = window.event ? event : e

    if (e.keyCode == 90 && e.ctrlKey) {

        for (let i = 0; i < sticks.length; i++) {
            const element = sticks[i];
            if (element.pointA == points[points.length - 1] || element.pointB == points[points.length - 1]) {
                sticks.splice(i,1)
                break
            }
        }

        points.splice(points.length-1, 1)
        draw();

    }

}
document.onkeydown = KeyPress;

/// Mouse move event
canvas.addEventListener("mousemove", function (event) {

    if (mouse_click_count < 1)
        return

    // mouse position related to canvas
    cRect = canvas.getBoundingClientRect()
    mouse_pos_X = Math.round(event.clientX - cRect.left)
    mouse_pos_Y = Math.round(event.clientY - cRect.top)

    draw()

    for (let i = 0; i < sticks.length; i++) {
        const s = sticks[i];

        let d1 = distanceBetweenTwoPoints(mouse_pos_X, mouse_pos_Y, s.pointA.PositionX, s.pointA.PositionY)
        let d2 = distanceBetweenTwoPoints(mouse_pos_X, mouse_pos_Y, s.pointB.PositionX, s.pointB.PositionY)

        if (d1 + d2 >= s.length - inaccuracy_treshhold && d1 + d2 <= s.length + inaccuracy_treshhold && event.ctrlKey) {
            sticks.splice(i, 1);
            i--;
        }

    }


})

// adds point on click
canvas.addEventListener('mouseup', function (event) {

    cRect = canvas.getBoundingClientRect();

    mouse_pos_X = Math.round(event.clientX - cRect.left);
    mouse_pos_Y = Math.round(event.clientY - cRect.top);


    switch (event.button) {
        // left click adds point
        case 0:
            points.push(new Point(mouse_pos_X, mouse_pos_Y, mouse_pos_X, mouse_pos_Y, false));
            break;
        // right click adds anchor point
        case 2:
            points.push(new Point(mouse_pos_X, mouse_pos_Y, mouse_pos_X, mouse_pos_Y, true));
            break;
    }

    let newpoint = points[points.length - 1];
    let connection_count = 0

    if (mouse_click_count < 1) {
        draw()
        mouse_click_count++;

        return;
    }

    // if multiple connections allowed, create sticks
    if (allowMultipleConnections == true) {
        for (let i = 0; i < points.length; i++) {
            const element = points[i]

            let distance = distanceBetweenTwoPoints(newpoint.PositionX, newpoint.PositionY, points[i].PositionX, points[i].PositionY)

            if (distance <= min_link_distance && connection_count < max_connection_count) {
                sticks.push(new Stick(newpoint, points[i], distance))
                connection_count++;
            }
        }
    }

    if (connection_count == 0) {
        let index = linkPoints()

        sticks.push(new Stick(newpoint, points[index], distanceBetweenTwoPoints(newpoint.PositionX, newpoint.PositionY, points[index].PositionX, points[index].PositionY)))
    }

    window.requestAnimationFrame(Simulate);

    mouse_click_count++;
});

// return index of closest point to new point
function linkPoints() {

    let index = 0;
    let newpoint = points[points.length - 1]
    let min = distanceBetweenTwoPoints(newpoint.PositionX, newpoint.PositionY, points[0].PositionX, points[0].PositionY)

    for (let i = 1; i < points.length - 1; i++) {
        const element = points[i]

        let dst = distanceBetweenTwoPoints(newpoint.PositionX, newpoint.PositionY, points[i].PositionX, points[i].PositionY)
        if (min > dst) {
            min = dst;
            index = i;
        }
    }

    return index;
}

// Checkbox actions
connectionBool.addEventListener("change", function () {

    if (connectionBool.checked == true) {
        allowMultipleConnections = true;
    }
    else {

        allowMultipleConnections = false;
    }

})

pointBool.addEventListener("change", function () {

    if (pointBool.checked == true) {
        showPoints = true;
    }
    else {

        showPoints = false;
    }

})

// resets simulation
resetbutton.addEventListener("click", function () {

    points = []
    sticks = []
    mouse_click_count = 0
    createGrid();
    draw()
})

gridButton.addEventListener("click", function () {

    createGrid()
})

// Freeze button action
freezeButton.addEventListener("click", function () {

    if (freezeSimulation == true) {
        freezeSimulation = false
        freezeButton.style.backgroundColor = "rgba(140, 167, 190)"
        Simulate()
    }
    else {
        freezeSimulation = true
        freezeButton.style.backgroundColor = "rgba(190, 168, 140)"

    }

})

function distanceBetweenTwoPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function clearCanvas() {
    canvas_context.beginPath();
    canvas_context.rect(0, 0, canvas.width, canvas.height);
    canvas_context.fillStyle = "#2E3440";
    canvas_context.fill();
}

function draw() {
    clearCanvas();


    // draw all connections
    sticks.forEach(s => {

        let d1 = distanceBetweenTwoPoints(mouse_pos_X, mouse_pos_Y, s.pointA.PositionX, s.pointA.PositionY)
        let d2 = distanceBetweenTwoPoints(mouse_pos_X, mouse_pos_Y, s.pointB.PositionX, s.pointB.PositionY)

        canvas_context.strokeStyle = "white"

        // if mouse hovers over stick: color it
        if (d1 + d2 >= s.length - inaccuracy_treshhold && d1 + d2 <= s.length + inaccuracy_treshhold) {

            canvas_context.strokeStyle = "cyan"
        }

        canvas_context.beginPath();
        canvas_context.lineWidth = 5
        canvas_context.moveTo(s.pointA.PositionX, s.pointA.PositionY);
        canvas_context.lineTo(s.pointB.PositionX, s.pointB.PositionY);
        canvas_context.stroke();
    });

    if(mouse_click_count > 5)
    logger.textContent = sticks[3].pointA.PositionY + " " + sticks.length + " " + points.length



    let connection_count = 0;

    // draw all points and color all points with connection distance
    if (showPoints == true) {
        points.forEach(p => {

            if (p.locked)
                canvas_context.fillStyle = "gray"
            else
                canvas_context.fillStyle = "white"

            if (distanceBetweenTwoPoints(mouse_pos_X, mouse_pos_Y, p.PositionX, p.PositionY) <= min_link_distance && connection_count < max_connection_count && allowMultipleConnections == true) {
                canvas_context.fillStyle = "lime"
                connection_count++
            }


            canvas_context.beginPath();
            canvas_context.arc(p.PositionX, p.PositionY, 7, 0, 2 * Math.PI);
            canvas_context.fill();
        });

        // draw closest point
        if (allowMultipleConnections == true)
            return

        let index = 0

        let shortestpath = distanceBetweenTwoPoints(mouse_pos_X, mouse_pos_Y, points[0].PositionX, points[0].PositionY)

        for (let i = 1; i < points.length; i++) {
            const element = points[i]

            let plenght = distanceBetweenTwoPoints(mouse_pos_X, mouse_pos_Y, element.PositionX, element.PositionY)

            if (plenght < shortestpath) {
                index = i
                shortestpath = plenght
            }

        }
        canvas_context.fillStyle = "green"
        canvas_context.beginPath();
        canvas_context.arc(points[index].PositionX, points[index].PositionY, 7, 0, 2 * Math.PI);
        canvas_context.fill();
    }
}