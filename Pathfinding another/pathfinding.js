
class wall {
    constructor(x, y, cell) {
        this.x = x
        this.y = y
        this.cell = cell // html table cell
    }
}

class node {
    constructor(x, y, cell) {
        this.x = x;
        this.y = y;
        this.cell = cell // html table cell

    }

    G // distance from starting node
    H // distance from end node
    F // G+H sum

    Parent
}

var Startnode = new node(StartX, StartY, Cells[StartX][StartY])
var TargetNode = new node(TargetX, TargetY, Cells[TargetX][TargetY])

Startnode.cell.classList.add('start');
TargetNode.cell.classList.add('end');

var Walls = []

var OpenSet = []
var ClosedSet = []
OpenSet.push(Startnode)

function reset()
{

    for (let i = 0; i < rowCount; i++)
        for (let j = 0; j < collumnCount; j++) {
            let cell = Cells[i][j]
            cell.classList.remove('closedSet')
            cell.classList.remove('path')

        }


    OpenSet = []
    ClosedSet = []
    OpenSet.push(Startnode)

}

//--------------------------------------------
// Main A* pathFinding function
//--------------------------------------------
function findPath() {

    while (OpenSet.length > 0 || OpenSet.length < (rowCount*collumnCount)) {

        let currentNode = OpenSet[0]
        currentNode.G = GetDistance(currentNode, Startnode)
        currentNode.H = GetDistance(currentNode, TargetNode)
        currentNode.F = currentNode.G + currentNode.H

        for (let i = 1; i < OpenSet.length; i++) {
            const element = OpenSet[i]
            element.G = GetDistance(element, Startnode)
            element.H = GetDistance(element, TargetNode)
            element.F = element.G + element.H

            if (element.F < currentNode.F || element.F == currentNode.F && element.H < currentNode.H) {
                currentNode = element
            }

        }

        RemoveFromOpenSet(currentNode)
        ClosedSet.push(currentNode)

        // visualization
        // if(currentNode != Startnode)
        // currentNode.cell.classList.add('closedSet')

        if (currentNode.x == TargetNode.x && currentNode.y == TargetNode.y-1) {
            DrawPath()
            // DrawNodes()

            return;
        }

        let neightbours = GetNeightbours(currentNode)

        for (let i = 0; i < neightbours.length; i++) {

            const element = neightbours[i];
            element.G = GetDistance(element, Startnode)
            element.H = GetDistance(element, TargetNode)
            element.F = element.G + element.H

            if (WallsContain(element.x, element.y) == true || SetContains(ClosedSet, element.x, element.y) == true) {
                continue

            }


            newMovementCostToNeightbour = currentNode.G + GetDistance(currentNode, element)

            if (newMovementCostToNeightbour < element.G || SetContains(OpenSet, element.x, element.y) == false) {
                element.G = newMovementCostToNeightbour
                element.H = GetDistance(element, TargetNode)
                element.Parent = currentNode

                if (!SetContains(OpenSet, element.x, element.y)) {
                    OpenSet.push(element)
                }
            }

        }

        Log()
    }

}

//--------------------------------------------
// draw final path
//--------------------------------------------
function DrawPath() {

    path = []
    let currentNode = ClosedSet[ClosedSet.length - 1]



    while (currentNode.x != Startnode.x && currentNode.y != Startnode.y) {

        path.push(currentNode)
        currentNode = currentNode.Parent

        if(currentNode != Startnode)
        currentNode.cell.classList.add('path')
    }

    path.reverse()
    // for (let i = 0; i < path.length; i++) {
    //     const element = path[i];
    //     //element.cell.classList.remove('closedSet')
    //     element.cell.classList.add('path')
    // }


}

function DrawNodes() {
    for (let i = 1; i < ClosedSet.length; i++) {
        if(!path.includes(ClosedSet[i]))
        ClosedSet[i].cell.classList.add('closedSet')
    }
}



//--------------------------------------------
// calculate H value between two nodes
//--------------------------------------------
function GetDistance(nodeA, nodeB) {
    dstX = Math.abs(nodeA.x - nodeB.x)
    dstY = Math.abs(nodeA.y - nodeB.y)
    return (dstX > dstY) ? (14 * dstY + 10 * (dstX - dstY)) : (14 * dstX + 10 * (dstY - dstX))

}


//--------------------------------------------
// find valid neighbours of node
//--------------------------------------------
function GetNeightbours(nodE) {
    let Neightbours = []


    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x == 0 && y == 0)
                continue

            // remove diagonals
            // if(x == -1 && y == -1 || x == 1 && y == 1 || x == 1 && y == -1 || x == -1 && y == 1)
            // continue

            checkX = nodE.x + x
            checkY = nodE.y + y

            if (checkX >= 0 && checkX < rowCount && checkY >= 0 && checkY < collumnCount) {


                Neightbours.push(new node(checkX, checkY, Cells[checkX][checkY]))
            }

        }

    }

    return Neightbours
}


//--------------------------------------------
// remove node object from OpenSet array
//--------------------------------------------
function RemoveFromOpenSet(currentNode) {
    for (let i = 0; i < OpenSet.length; i++) {
        const element = OpenSet[i];
        if (element.x == currentNode.x && element.y == currentNode.y) {
            OpenSet.splice(i, 1)
            break;
        }
    }
}


//--------------------------------------------
// checks if given array contains x y values
//--------------------------------------------
function SetContains(set, x, y) {
    let contains = false
    for (let i = 0; i < set.length; i++) {
        const element = set[i]
        if (element.x == x && element.y == y) {
            contains = true

        }
    }

    return contains
}


//--------------------------------------------
// checks if walls contains x y values
//--------------------------------------------
function WallsContain(x, y) {

    if (x == Startnode.x && y == Startnode.y) {
        return true

    }
    else if (x == TargetNode.x && y == TargetNode.y)
        return true

    let contains = false
    for (let i = 0; i < Walls.length; i++) {
        const element = Walls[i]
        if (element.x == x && element.y == y) {
            contains = true

        }
    }

    return contains
}


//--------------------------------------------
// Logs everything
//--------------------------------------------
function Log() {
    logger.innerHTML = ''
    // logger.innerHTML += 'Walls: ' + Walls.length + '\n'
    // logger.innerHTML += 'Closed Set: ' + ClosedSet.length + '\n'
    // logger.innerHTML += 'Open Set: ' + OpenSet.length + '\n'
    logger.innerHTML += 'X: ' + HoverX + ' Y: ' + HoverY + '<br>'
    logger.innerHTML += 'StartX: ' + Startnode.x + ' StartY: ' + Startnode.y + '<br>'
    logger.innerHTML += 'Hover Start Node: ' + (HoverStart == true) + '<br>'
    logger.innerHTML += "Create wall : " + (HoverX != Startnode.x && HoverY != Startnode.y && HoverStart == false) + '<br>'
    logger.innerHTML += "mouseDOwn : " + mouseDown + '<br>';


}

//--------------------------------------------
// draws a wall on mousedown event
//--------------------------------------------
function drawWall(event, cell) {

    let idxy = cell.id.split('-');
    let posx = HoverX
    let posy = HoverY

    newWall = new wall(posx, posy, cell)

    if (WallsContain(newWall.x, newWall.y) == false) {
        Walls.push(newWall)
        cell.classList.add('wall');


    } //wallsContains


}