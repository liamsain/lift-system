const States = {
  WaitingForInstruction: 'waitingForInstruction',
  Moving: 'moving',
  MovingUp: 'movingUp',
  MovingDown: 'movingDown',
  WaitingAtDestination: 'waitingAtDestination'
};


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
    this.state = States.WaitingForInstruction;
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
    if (this.state === States.Moving)
      return undefined;
    const match = this.building.floorsYStartPositions.findIndex(y => y === this.y + this.height);
    return match;
  }

  update() {
    if (this.state === States.WaitingForInstruction) {
      if (this.destinations.length > 0) {
        this.state = States.Moving;
      }
    } else if (this.state === States.Moving) {
      const destination = this.destinations[0];
      if (this.y !== destination) {
        if (this.y > destination)
          this.y -= this.speed;
        else
          this.y += this.speed;
      } else {
        this.state = States.WaitingAtDestination;
        this.destinations.shift();
      }
    } else if (this.state === States.WaitingAtDestination) {
      if (this.waitedFor >= this.waitingTime) {
        this.state = States.WaitingForInstruction;
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
