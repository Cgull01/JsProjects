
const colors = {
  background: "black",
  elements: "white"
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let x = Math.floor(Math.random() * (max - min) + min)
  if (x == 0)
      x++;
  return x; //The maximum is exclusive and the minimum is inclusive
}

function distanceBetweenTwoPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function clearScreen(context) {
  context.fillStyle = colors.background;
  context.fillRect(0, 0, canvas1.clientWidth, canvas1.height);
}

