const canvas1 = document.getElementById("canvas1");
const addPointBtn = document.getElementById("AddPointBtn");
const removePointBtn = document.getElementById("RemovePointBtn");
////////////////////////////////////////////////////////////////
/// get computed style for image
let cs1 = getComputedStyle(canvas1);

/// these will return dimensions in *pixel* regardless of what
/// you originally specified for image:
let width1 = parseInt(cs1.getPropertyValue("width"), 10);
let height1 = parseInt(cs1.getPropertyValue("height"), 10);

/// now use this as width and height for your canvas element:
canvas1.width = width1;
canvas1.height = height1;

window.addEventListener("resize", resize);

function resize() {
  width1 = parseInt(cs1.getPropertyValue("width"), 10);
  height1 = parseInt(cs1.getPropertyValue("height"), 10);
  canvas1.width = width1;
  canvas1.height = height1;

  clearScreen(ctx1);
}

////////////////////////////////////////////////////////////////
logger = document.getElementById("logger");

let ctx1 = canvas1.getContext("2d");

let framesPerSecond1 = 120;
let circleWidth1 = 2;
let CircleCount1 = 4;
let pause1 = false;

const Circles = [];

function GenerateCircles() {
  for (let i = 0; i < CircleCount1; i++) {
    Circles.push(
      new Circle(
        getRandomInt(0, canvas1.width), // x
        getRandomInt(0, canvas1.height), // y
        getRandomInt(5, 10),
        getRandomInt(-1, 1),
        getRandomInt(-1, 1)
      )
    );
  }
}

function Drawline(x1, y1, x2, y2, distance) {
  ctx1.lineWidth = 1;
  ctx1.strokeStyle = "rgba(255,255,255," + 0.1 / (distance / 80) + ")";
  ctx1.moveTo(x1, y1);
  ctx1.lineTo(x2, y2);
  ctx1.stroke();
}

function towardZero(num) {
  return num > 0 ? num - 0.2 : num + 0.2;
}

function Pause1() {
  pause1 = !pause1;
}

function Update() {
  setInterval(function () {
    if (pause1 == true) return;

    clearScreen(ctx1);

    for (let c of Circles) {
      for (let p of Circles) {
        let dist = distanceBetweenTwoPoints(c.x, c.y, p.x, p.y);
        if (dist < 250) Drawline(c.x, c.y, p.x, p.y, dist);
      }

      c.x += c.vx;
      c.y += c.vy;

      c.fill(ctx1);

      if (c.y + c.vy > canvas1.height || c.y + c.vy < 0) {
        c.vy = -c.vy;
      }
      if (c.x + c.vx > canvas1.width || c.x + c.vx < 0) {
        c.vx = -c.vx;
      }
    }

    // requestAnimationFrame(Update)
  }, 1000 / framesPerSecond1);
}

addPointBtn.addEventListener("click", () => {
  Circles.push(
    new Circle(
      getRandomInt(0, canvas1.width), // x
      getRandomInt(0, canvas1.height), // y
      getRandomInt(5, 10),
      getRandomInt(-1, 1),
      getRandomInt(-1, 1)
    )
  );
});

removePointBtn.addEventListener("click", () => {
  Circles.pop();
  console.log(Circles.length)
});

GenerateCircles();

clearScreen(ctx1);

Update();
