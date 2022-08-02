/**
 * Setup the canvas element
 */


function setup() {
  w = window.innerWidth;
  h = window.innerHeight;

  isDrawingStraight = false;

  size = 40;
  mouseIsDown = false;
  Points = [];

  var canvas_wrapper = document.getElementById('canvas-wrapper');
  canvas_wrapper.innerHTML = '';
  canvas_wrapper.innerHTML += '<canvas id="board" width="' + w + '" height="' + h + '"></canvas>';
  canvas_wrapper.innerHTML += '<div class="dimensions">' + w + 'px x ' + h + 'px</div>';
  var canvas = document.getElementById('board');
  c = canvas.getContext('2d');

  cRect = canvas.getBoundingClientRect();

  document.addEventListener("mousedown", () => {
    mouseIsDown = true;
  })

  document.addEventListener("mouseup", () => {
    mouseIsDown = false;

    Points.push(new Point(posx, posy));


      Points.slice(Points.length - 2, Points.length - 1);
      let endPoint = Points[Points.length - 1];
      let lastPoint = Points[Points.length - 2];



      c.strokeStyle = "black";
      c.lineWidth = 5;

      c.beginPath();
      c.moveTo(endPoint.x, endPoint.y);
      c.lineTo(lastPoint.leftChild.x, lastPoint.leftChild.y);
      c.moveTo(endPoint.x, endPoint.y);
      c.lineTo(lastPoint.rightChild.x, lastPoint.rightChild.y);
      c.stroke();





  })
  document.addEventListener("mousemove", (event) => {
    if (mouseIsDown) {
      posx = Math.round(event.clientX - cRect.left);
      posy = Math.round(event.clientY - cRect.top);



      if (Points.length > 0) {
        if (distanceBetweenTwoPoints(posx, posy, Points[Points.length - 1].x, Points[Points.length - 1].y) > 50) {
          let xv = posx - Points[Points.length - 1].x;
          let yv = posy - Points[Points.length - 1].y;

          let l = new Point(posx - 20, posy);
          let r = new Point(posx + 20, posy);

          l = getParallelSegment(posx, posy, Points[Points.length - 1].x, Points[Points.length - 1].y, 20, 1);

          r = getParallelSegment(posx, posy, Points[Points.length - 1].x, Points[Points.length - 1].y, -20, 1);


          Points.push(new Point(posx, posy, l, r));
          render();

          isDrawingStraight = !isDrawingStraight;
        }

      }
      else {
        Points.push(new Point(posx, posy));
        render();
      }

    }


  })

  c.fillStyle = 'rgba(255, 255, 255, 1)';
  c.fillRect(0, 0, w, h);

}

function getParallelSegment(Ax, Ay, Bx, By, d, side) {
  // --- Return a line segment parallel to AB, d pixels away
  var dx = Ax - Bx,
    dy = Ay - By,
    dist = Math.sqrt(dx * dx + dy * dy) / 2;
  side = side || 1;
  dx *= side * d / dist;
  dy *= side * d / dist;
  return new Point(Ax + dy, Ay - dx);
}


var render = function () {

  let prevPoint = Points[Points.length - 2];
  let point = Points[Points.length - 1];

  // c.fillStyle = 'red';
  // c.beginPath();
  // c.arc(point.x, point.y, 5, 0, 2 * Math.PI); // x, y, radius, startangle
  // c.arc(point.rightChild.x, point.rightChild.y, 5, 0, 2 * Math.PI); // x, y, radius, startangle
  // c.arc(point.leftChild.x, point.leftChild.y, 5, 0, 2 * Math.PI); // x, y, radius, startangle
  // c.fill();


  c.strokeStyle = "black";
  c.lineCap = 'round';

  c.lineWidth = 5;
  if (isDrawingStraight) {
    c.beginPath();
    c.moveTo(prevPoint.leftChild.x, prevPoint.leftChild.y);
    c.lineTo(point.leftChild.x, point.leftChild.y);
    c.moveTo(prevPoint.rightChild.x, prevPoint.rightChild.y);
    c.lineTo(point.rightChild.x, point.rightChild.y);
    c.moveTo(prevPoint.x, prevPoint.y);
    c.lineTo(point.x, point.y);
    c.stroke();
  }
  else {
    c.beginPath();

    // middle to right
    c.moveTo(prevPoint.x, prevPoint.y);
    c.lineTo(point.rightChild.x, point.rightChild.y);

    // right to middle
    c.moveTo(prevPoint.rightChild.x, prevPoint.rightChild.y);
    c.lineTo(point.x, point.y);

    // middle to left
    c.moveTo(prevPoint.x, prevPoint.y);
    c.lineTo(point.leftChild.x, point.leftChild.y);

    // left to middle
    c.moveTo(prevPoint.leftChild.x, prevPoint.leftChild.y);
    c.lineTo(point.x, point.y);
    c.stroke();

    c.lineCap = 'round';

    c.strokeStyle = "white";
    c.lineWidth = 24;

    c.beginPath();

    c.moveTo((prevPoint.x + prevPoint.rightChild.x) / 2, (prevPoint.y + prevPoint.rightChild.y) / 2);
    c.lineTo((point.x + point.leftChild.x) / 2, (point.y + point.leftChild.y) / 2);

    c.stroke();


    // c.fillStyle = 'red';
    // c.beginPath();

    // // c.arc((prevPoint.x + prevPoint.rightChild.x)/2, prevPoint.y, 5, 0, 2 * Math.PI);
    // // c.arc((point.x + point.leftChild.x)/2, point.y, 5, 0, 2 * Math.PI);
    // c.arc((prevPoint.x + prevPoint.rightChild.x)/2, (prevPoint.y+prevPoint.rightChild.y)/2, 5, 0, 2 * Math.PI);
    // c.arc((point.x + point.leftChild.x)/2, (point.y+point.leftChild.y)/2, 5, 0, 2 * Math.PI);
    // c.fill();
  }
}


function resized() {
  clearInterval(renderer);
  setup();
}
/**
 * Run the setup on launch and add event listener
 * to rerun the setup if the window resizes.
 */
setup();




window.addEventListener('resize', resized);


function distanceBetweenTwoPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}