// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Part 1: https://youtu.be/aKYlikFAV4k
// Part 2: https://youtu.be/EaZxUCWAjb0
// Part 3: https://youtu.be/jwRT4PCT6RU

// Function to delete element from the array
function removeFromArray(arr, elt) {
    // Could use indexOf here instead to be more efficient
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

// An educated guess of how far it is between two points
function heuristic(a, b) {
    //var d = dist(a.i, a.j, b.i, b.j);
    var d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
    return d;
}


var cols = collumnCount;
var rows = rowCount;

var grid = new Array(cols);

var openSet = [];
var closedSet = [];

var start;
var end;

var portalStart;
var portalEnd;

var current;

var path = [];

setup();
function setup() {
    console.log('A*');

    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j, Cells[j][i]);
            grid[i][j].show();
        }
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[12][15]
    end = grid[58][14]

    // portalStart = grid[12][9]
    // portalEnd = grid[52][10]

    // portalStart.wall = false;
    // portalEnd.wall = false;

    start.wall = false;
    end.wall = false;

    // openSet starts with beginning only
    openSet.push(start);

    // portalStart.show('portalStart');
    // portalEnd.show('portalEnd');

    start.show('start')
    end.show('end')

}
draw()
function draw() {

    for (let i = 0; i < path.length; i++) {
        path[i].cell.classList.remove('path');
    }

    for (let i = 0; i < openSet.length; i++) {
        openSet[i].cell.classList.remove('closedSet');
    }
    // Start and ends
    start = grid[start.i][start.j];
    //  end = grid[27][25];

    start.wall = false;
    end.wall = false;

    openSet = [];

    closedSet = [];

    path = [];

    current = undefined

    // openSet starts with beginning only
    openSet.push(start);
    start.show(false)
    end.show(false);

    start.cell.classList.add('start');
    end.cell.classList.add('end');
    // Am I still searching?
    while (openSet.length > 0 || openSet.length < 200) {

        // Best next option
        var winner = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        current = openSet[winner];
        // Did I finish?
        if (current === end) {

            console.log("DONE!");
            showPath()
            break;

        }

        // Best option moves from openSet to closedSet
        removeFromArray(openSet, current);

        closedSet.push(current);

        // Check all the neighbors
        var neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            // Valid next spot?
            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                var tempG = current.g + heuristic(neighbor, current);

                // Is this a better path than before?
                var newPath = false;
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);

                }

                // Yes, it's a better path
                if (newPath) {

                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }

        }



        // Find the path by working backwards
        path = [];
        arr = [];
        var temp = current;
        path.push(temp);
        //temp.show('closedSet')
        let iter = 0;
        while (temp.previous) {
            iter++;
            if (arr.includes(temp.previous))
                break;
            arr.push(temp.previous)
            path.push(temp.previous);
            temp = temp.previous;
        }

    }


}

function showPath() {
    path = path.splice(0, path.length - 2);

    for (let i = 0; i < path.length; i++) {
        path[i].show('path');
    }

}