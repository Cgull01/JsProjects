const canvas = document.querySelector('#canvas');
const clearCanvasCheckBox = document.querySelector('#clearCanvasCheck');
const startBtn = document.querySelector('#startBtn');

clearCanvasCheckBox.addEventListener('click', () => {
  enableCanvasClear = !enableCanvasClear;
})


////////////////////////////////////////////////////////////////
let cs = getComputedStyle(canvas);

let width = parseInt(cs.getPropertyValue('width'), 10);
let height = parseInt(cs.getPropertyValue('height'), 10);

canvas.width = width;
canvas.height = height;

let mouseIsDown = false;

//! make it true
let enableCanvasClear = true;

const framesPerSecond = 60;
const treshhold = 1;

const vectorMoveTime = 10;
let PointCount = 0;

let ctx = canvas.getContext('2d');

const colors = {
  background: "black",
  elements: "white"
}

window.addEventListener('resize', resize);

function resize() {

  width = parseInt(cs.getPropertyValue('width'), 10);
  height = parseInt(cs.getPropertyValue('height'), 10);
  canvas.width = width;
  canvas.height = height;

  clearScreen();

}
function clearScreen() {
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);
}

////////////////////////////////////////////////////////////////
P = new Array();
let iterations = 0;

class Point {
  constructor(x, y, radius, color, parentX, parentY, vx, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color
    this.parentX = parentX;
    this.parentY = parentY;
    this.vx = vx;
    this.vy = vy;
  }

  draw() {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); // x, y, radius, startangle
    ctx.stroke();

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius / 2, 0, 2 * Math.PI); // x, y, radius, startangle
    ctx.fill();
  }
}

clearScreen();


function generatePointsChaotically() {
  for (let i = 0; i < PointCount; i++) {
    let x = getRandomInt(10, canvas.width)
    let y = getRandomInt(10, canvas.height)

    P.push(new Point(x, y, 5, "white"));
  }

  P[0].parentX = P[P.length - 1].x;
  P[0].parentY = P[P.length - 1].y;

  for (let i = 1; i < PointCount; i++) {
    P[i].parentX = P[i - 1].x;
    P[i].parentY = P[i - 1].y;
  }

  addVectorsToPoints();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let x = Math.floor(Math.random() * (max - min) + min)
  if (x == 0)
    x++;
  return x; //The maximum is exclusive and the minimum is inclusive
}

P.forEach(point => {
  point.draw();
});


function addVectorsToPoints() {
  for (let i = 0; i < PointCount; i++) {

    P[i].vx = (P[i].parentX - P[i].x) / vectorMoveTime;
    P[i].vy = (P[i].parentY - P[i].y) / vectorMoveTime;
  }
}

function Update() {

  setTimeout(() => {
    requestAnimationFrame(Update)

    if (enableCanvasClear)
      clearScreen();

    if (iterations >= vectorMoveTime) {
      iterations = 0;
      addVectorsToPoints();
    }

    P.forEach(point => {

      point.x += point.vx;
      point.y += point.vy;
      point.draw();
    });

    for (let i = 1; i < PointCount; i++) {


      P[0].parentX = P[P.length - 1].x;
      P[0].parentY = P[P.length - 1].y;

      P[i].parentX = P[i - 1].x;
      P[i].parentY = P[i - 1].y;
    }

    iterations++;
  }, 1000 / framesPerSecond)

}

function DistanceBetweenTwoPoints(x1,x2,y1,y2)
{
  return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );

}

canvas.addEventListener("mousedown",()=>{
mouseIsDown = true;
})
canvas.addEventListener("mouseup",()=>{
mouseIsDown = false;
})

canvas.addEventListener("mousemove",()=>{

  if(!mouseIsDown)
  return;

  cRect = canvas.getBoundingClientRect();
  posx = Math.round(event.clientX - cRect.left);
  posy = Math.round(event.clientY - cRect.top);

  let pointTooClose = false;
  for(point of P)
  {
    if(DistanceBetweenTwoPoints(point.x, posx, point.y,posy)<25)
    pointTooClose = true;
  }

  if(pointTooClose == false)
  {
    if(PointCount % 2 == 0)
    P.push(new Point(posx, posy,5, "green"));
    else if(PointCount % 3 == 0)
    P.push(new Point(posx, posy,5, "white"));
    else
    P.push(new Point(posx, posy,5, "yellow"));


    P[P.length-1].draw();

    PointCount++;


      for (let i = 1; i < PointCount; i++) {
        P[i].parentX = P[i - 1].x;
        P[i].parentY = P[i - 1].y;
      }

        P[0].parentX = P[P.length - 1].x;
        P[0].parentY = P[P.length - 1].y;




    if (PointCount >= 2)
    {
      addVectorsToPoints();
    }

  }


})

clearScreen();


startBtn.addEventListener("click",()=>{
  Update();
  startBtn.style.visibility = 'hidden';
})
