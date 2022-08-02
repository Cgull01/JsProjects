const canvas = document.querySelector('#canvas');

////////////////////////////////////////////////////////////////
let cs = getComputedStyle(canvas);

let width = parseInt(cs.getPropertyValue('width'), 10);
let height = parseInt(cs.getPropertyValue('height'), 10);

canvas.width = width;
canvas.height = height;

let ctx = canvas.getContext('2d');

 window.addEventListener('resize', resize);

function resize() {

  width = parseInt(cs.getPropertyValue('width'), 10);
  height = parseInt(cs.getPropertyValue('height'), 10);
  canvas.width = width;
  canvas.height = height;

  clearScreen();

}
function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);
}

////////////////////////////////////////////////////////////////

let dimensions = canvas.width;
let limit = dimensions;
let depth = 6;


function draw()
{
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);

  for (let i = 1; i <= depth; i++) {
    sierpinskiCarpet(0, 0, dimensions);
    limit = limit / 3;
  }
}

function sierpinskiCarpet(x, y, size) {

  setTimeout(() => {
    if (size < limit)
      return;
    size = size / 3;

    for (let m = 0; m < 3; m++) {
      for (let n = 0; n < 3; n++) {
        if (!(m == 1 && n == 1)) {
          sierpinskiCarpet(x + size * n, y + size * m, size);

        }
        else {
          ctx.fillStyle = `rgb(255,255,255)`;
          ctx.fillRect(x + size, y + size, size, size);


        }

      }
    }
  }, 100);
}

clearScreen();
draw();
