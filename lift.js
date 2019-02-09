class Lift {
  constructor(x, y, width, height, building) {
    this.x = x;
    this.y = y - height;
    this.destY = this.y;
    this.height = height;
    this.width = width;
    this.speed = 0.5;
    this.isMoving = false;
    this.building = building;
  }
  draw(ctx) {
    this.move();
    // draw lift line
    const horizontalCenter = this.x + this.width / 2;
    ctx.moveTo(horizontalCenter, this.y);
    ctx.lineTo(horizontalCenter, this.building.y);
    // draw lift box
    ctx.rect(this.x, this.y, this.width, this.height);
  }
  get currentFloor() {
    if (this.moving)
      return undefined;
    const match = this.building.floorsYStartPositions.findIndex(y => y === this.y + this.height);
    return match;
  }

  move() {
    if (this.y !== this.destY) {
      this.isMoving = true;
      if (this.y > this.destY)
        this.y -= this.speed;
      else
        this.y += this.speed;
    } else {
      this.isMoving = false;
    }
  }

  goToFloor(number) {
    if (this.isMoving) {
      return;
    }
    const groundFloorY = this.building.y + this.building.height - this.height;
    const distanceToTravel = number * this.height;
    const destY = groundFloorY - distanceToTravel;
    this.destY = destY;
  }
}
