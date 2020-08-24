const LiftStates = {
  Idle: 'idle',
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
    this.upDestinations = [];
    this.downDestinations = [];
    this.waitingTime = 100;
    this.waitedFor = 0;
    this.state = LiftStates.Idle;
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
    if (this.state === LiftStates.Moving)
      return undefined;
    const match = this.building.floorsYStartPositions.findIndex(y => y === this.y + this.height);
    return match;
  }

  update() {
  //
  //at rest
  //hey, someone wants to go up
  //am i going up or down?
  //up
  //ok, go to them
  //wait for them to get in
  //head to where they wanna go
  //
    if (this.state === LiftStates.Idle) {
      if (this.destinations.length > 0) {
        this.state = LiftStates.Moving;
      }
    } else if (this.state === LiftStates.MovingUp) {
      this.moveUp();
      /*const destination = this.destinations[0];
      if (this.y !== destination) {
        if (this.y > destination)
          this.y -= this.speed;
        else
          this.y += this.speed;
      } else {
        this.state = LiftStates.WaitingAtDestination;
        this.destinations.shift();
      }
      */
    } else if(this.state === LiftStates.MovingDown) {
      this.moveDown();
    } else if (this.state === LiftStates.WaitingAtDestination) {
      this.waitForInstruction();
    }
  }
  waitForInstruction() {
    if (this.waitedFor >= this.waitingTime) {
      this.state = LiftStates.Idle;
      const goingUp = this.destinations[0] < this.y;
      if (goingUp) {
        // highest to lowest
        this.destinations.sort((a, b) => b - a);
      } else {
        this.destinations.sort((a, b) => a - b);
      }
      this.waitedFor = 0;
    }
    this.waitedFor += 1;
  }
  moveUp() {
    
  }
  moveDown() {}

  goToFloor(number) {
    const groundFloorY = this.building.y + this.building.height - this.height;
    const distanceToTravel = number * this.height;
    const destY = groundFloorY - distanceToTravel;
    if (!this.destinations.includes(destY)) {
      this.destinations.push(destY);
    } 
  }
  get isMoving() {
    return this.state === LiftStates.Moving;
  }
  goingUp(floorNumber) {
    if (!this.upDestinations.includes(floorNumber)) {
      this.upDestinations.push(floorNumber);
    }
  }
  goingDown(floorNumber) {
    if (!this.downDestinations.includes(floorNumber)) {
      this.downDestinations.push(floorNumber);
    }
  }

}
