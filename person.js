const hexNumbers = '0123456789ABCDEF';

class State {
  constructor() {
    this.enteringBuilding = true;
    this.headingTowardsLift = false;
    this.callingLift = false;
    this.waitingForLift = false;
    this.gettingInsideLift = false;
    this.choosingFloor = false;
    this.waitingInsideLift = false;
    this.goingToWork = false;
    this.working = false;
  }
}

class Person {
  constructor(x, y, height, building) {
    this.height = height;
    this.x = x;
    this.y = y - height;
    this.building = building;
    this.width = height / 2;
    this.colour = this.getRandomColour(); 
    this.whatever = 5;
    this.state = new State();
    this.speed = Math.random() * (2 - 0.5) + 0.5;
    this.destinationFloor = 0;
    this.workingTime = 0;
    this.timeWorked = 0;
  }

  getRandomColour() {
    let colour = '#';
    for(let i = 0; i < 6; i++){
      colour += hexNumbers[Math.floor(Math.random() * hexNumbers.length)];
    }
    return colour;
  }

  update() {
    if (this.state.enteringBuilding) {
      this.goToBuildingEntrance();
    } else if (this.state.headingTowardsLift) {
      this.goToLiftEntrance();
    } else if (this.state.callingLift) {
      this.callLift();
    } else if (this.state.waitingForLift) {
      this.waitForLift();
    } else if (this.state.gettingInsideLift) {
      this.goIntoLift();
    } else if (this.state.choosingFloor) {
      this.chooseFloor();
    } else if (this.state.waitingInsideLift) {
      this.waitInsideLift();
    } else if (this.state.goingToWork) {
      this.goToWork();
    } else if (this.state.working) {
      this.work();
    }
  }

  draw(ctx) {
    this.update();
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.colour;
    ctx.fill();
    ctx.closePath();
  }

  goToPoint(x, y) {
    if (this.x > x) {
      this.x -= this.speed;
    } else if (this.x < x) {
      this.x += this.speed;
    }
    if (this.y > y) {
      this.y -= this.speed;
    } else if (this.y < y) {
      this.y += this.speed;
    }
  }

  destinationReached(dest) {
    const tolerance = 3;
    const xWithinRange = (this.x >= dest.x - tolerance && this.x <= dest.x + tolerance);
    const yWithinRange = (this.y >= dest.y - tolerance && this.y <= dest.y + tolerance);
    return xWithinRange && yWithinRange;
  }

  goToBuildingEntrance() {
    const destination = {
      x: this.building.entrance.x,
      y: this.building.entrance.y - this.height
    };
    console.log(destination, {x: this.x, y: this.y} );
    if (this.destinationReached(destination)) {
      this.state.enteringBuilding = false;
      this.state.headingTowardsLift = true;
      return;
    }
    this.goToPoint(destination.x, destination.y);
  }

  goToLiftEntrance() {
    const destination = {
      x: this.building.liftEntranceX + this.width,
      y: this.y
    };
    if (this.destinationReached(destination)) {
      this.state.headingTowardsLift = false;
      this.state.callingLift = true;
      return;
    }
    this.goToPoint(destination.x, destination.y);
  }

  callLift() {
    this.building.lift.goToFloor(this.currentFloor);
    this.state.callingLift = false;
    this.state.waitingForLift = true;
  }

  waitForLift() {
    if (this.currentFloor === this.building.lift.currentFloor) {
      this.state.waitingForLift = false;
      this.state.gettingInsideLift = true;
    }
  }

  goIntoLift() {
    const dest = {
      x: this.building.lift.x + (this.building.lift.width / 2),
      y: this.building.lift.y + this.building.lift.height - this.height - this.building.strokeLineWidth
    }
    if (this.destinationReached(dest)) {
      this.state.gettingInsideLift = false;
      this.state.choosingFloor = true;
      return;
    }
    if (!this.building.lift.isMoving) {
      this.goToPoint(dest.x, dest.y);
    }
  }

  chooseFloor() {
    this.destinationFloor = Math.floor(Math.random() * Math.floor(this.building.floors));
    this.building.lift.goToFloor(this.destinationFloor);
    this.state.choosingFloor = false;
    this.state.waitingInsideLift = true;
  }

  waitInsideLift() {
    const destinationReached = !this.building.lift.state.moving && this.currentFloor === this.destinationFloor;
    if (!destinationReached) {
      const bottomOfLift = this.building.lift.y + this.building.lift.height - this.building.strokeLineWidth;
      this.y = bottomOfLift - this.height;
    } else {
      this.state.waitingInsideLift = false;
      this.state.goingToWork = true;
    }
  }

  goToWork() {
    const dest = {
      x: this.building.x + (this.building.width / 2),
      y: this.y
    };
    if (this.destinationReached(dest)) {
      this.state.goingToWork = false;
      this.state.working = true;
      return;
    }
    this.goToPoint(dest.x, dest.y);
  }

  work() {
    if (this.workingTime === 0) {
      const minTime = 800;
      const maxTime = 3000;
      this.workingTime = Math.floor(Math.random() * (maxTime - minTime) + minTime);
    }
    if (this.timeWorked > this.workingTime) {
      this.state.working = false;
      this.state.headingTowardsLift = true;
      this.workingTime = 0;
      this.timeWorked = 0;
      return;
    }
    this.timeWorked += 1;
  }

  get currentFloor() {
    const currentY = this.y + this.height;
    const tolerancePixels = 10;
    const match = this.building.floorsYStartPositions.findIndex(y => y > currentY - tolerancePixels && y < currentY + tolerancePixels);
    return match;
  }
}
