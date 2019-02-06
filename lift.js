class Lift {
  constructor(x, y, width, height, upperLimitY) {
    this.x = x;
    this.y = y - height;
    this.destY = this.y;
    this.height = height;
    this.width = width;
    this.upperLimitY = upperLimitY;
    this.lowerLimitY = y + height;
    this.speed = 0.5;
    this.isMoving = false;
  }

  draw(ctx) {
    this.move();
    const horizontalCenter = this.x + this.width / 2;
    ctx.moveTo(horizontalCenter, this.y);
    ctx.lineTo(horizontalCenter, this.upperLimitY);
    ctx.rect(this.x, this.y, this.width, this.height);
  }

  move() {
    if (this.y !== this.destY) {
      this.isMoving = true;
      if (this.y > this.destY) {
        this.y -= this.speed;
      } else {
        this.y += this.speed;
      }
    } else {
      this.isMoving = false;
    }
  }

  goToFloor(number) {
    const groundFloorY = this.lowerLimitY - this.height;
    const distanceToTravel = (number + 1) * this.height;
    const destY = groundFloorY - distanceToTravel;
    if (destY <= this.lowerLimitY && destY >= this.upperLimitY) {
      this.destY = destY;
    }
  }
}
