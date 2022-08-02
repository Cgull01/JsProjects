
class Circle {
  constructor(x, y, radius, vx, vy, angle) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = colors.elements
    this.vx = vx
    this.vy = vy
    this.angle = angle
  }

  fill(ctx) {
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