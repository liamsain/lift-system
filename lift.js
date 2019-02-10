class LiftState {
  constructor() {
    this.waitingForInstruction = true;
    this.moving = false;
    this.waitingAtDestination = false;
  }
}
class Lift {
  constructor(x, y, width, height, building) {
    this.x = x;
    this.y = y - height;
    this.building = building;
    this.destY = this.y;
    this.height = height;
    this.width = width;
    this.speed = 0.5;
    this.destinations = [];
    this.waitingTime = 50;
    this.waitedFor = 0;
    this.state = new LiftState();
  }

  draw(ctx) {
    this.update();
    // draw lift line
    const horizontalCenter = this.x + this.width / 2;
    ctx.moveTo(horizontalCenter, this.y);
    ctx.lineTo(horizontalCenter, this.building.y);
    // draw lift box
    ctx.rect(this.x, this.y, this.width, this.height);
  }

  get currentFloor() {
    if (this.state.moving)
      return undefined;
    const match = this.building.floorsYStartPositions.findIndex(y => y === this.y + this.height);
    return match;
  }

  update() {
    if (this.state.waitingForInstruction) {
      if (this.destinations.length > 0) {
        this.state.waitingForInstruction = false;
        this.state.moving = true;
      }
    } else if (this.state.moving) {
      const destination = this.destinations[0];
      if (this.y !== destination) {
        if (this.y > destination)
          this.y -= this.speed;
        else
          this.y += this.speed;
      } else {
        this.state.moving = false;
        this.state.waitingAtDestination = true;
        this.destinations.shift();
      }
    } else if (this.state.waitingAtDestination) {
      if (this.waitedFor >= this.waitingTime) {
        this.state.waitingAtDestination = false;
        this.state.waitingForInstruction = true;
        const goingUp = this.destinations[0] < this.y;
        if (goingUp) {
          // highest to lowest
          this.destinations.sort((a, b) => b - a);
        } else {
          this.destinations.sort((a, b) => a - b);
        }
        console.log(this.destinations);
        this.waitedFor = 0;
      }
      this.waitedFor += 1;
    }
  }

  goToFloor(number) {
    const groundFloorY = this.building.y + this.building.height - this.height;
    const distanceToTravel = number * this.height;
    const destY = groundFloorY - distanceToTravel;
    if (!this.destinations.includes(destY)) {
      this.destinations.push(destY);
      console.log(this.destinations);
    }
  }
}
