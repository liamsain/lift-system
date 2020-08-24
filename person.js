const hexNumbers = '0123456789ABCDEF';

const PersonStates = {
  EnteringBuilding: 'enteringBuilding',
  HeadingTowardsLift: 'headingTowardsLift',
  CallingLift: 'callingLift',
  WaitingForLift: 'waitingForLift',
  GettingInsideLift: 'gettingInsideLift',
  ChoosingFloor: 'choosingFloor',
  WaitingInsideLift: 'waitingInsideLift',
  GoingToWork: 'goingToWork',
  Working: 'working'
};

class Person {
  constructor(x, y, height, building) {
    this.height = height;
    this.x = x;
    this.y = y - height;
    this.building = building;
    this.width = height / 2;
    this.colour = this.getRandomColour(); 
    this.state = PersonStates.EnteringBuilding;
    // this.speed = Math.random() * (1.2 - 0.3) + 0.5;
    this.speed = 1.2;
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
    if (this.state === PersonStates.EnteringBuilding) {
      this.goToBuildingEntrance();
    } else if (this.state === PersonStates.HeadingTowardsLift) {
      this.goToLiftEntrance();
    } else if (this.state === PersonStates.CallingLift) {
      this.callLift();
    } else if (this.state === PersonStates.WaitingForLift) {
      this.waitForLift();
    } else if (this.state === PersonStates.GettingInsideLift) {
      this.goIntoLift();
    } else if (this.state === PersonStates.ChoosingFloor) {
      this.chooseFloor();
    } else if (this.state === PersonStates.WaitingInsideLift) {
      this.waitInsideLift();
    } else if (this.state === PersonStates.GoingToWork) {
      this.goToWork();
    } else if (this.state === PersonStates.Working) {
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
    if (this.destinationReached(destination)) {
      this.state = PersonStates.HeadingTowardsLift;
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
      this.state = PersonStates.CallingLift;
      return;
    }
    this.goToPoint(destination.x, destination.y);
  }

  callLift() {
    let destinationFloorMatchesCurrentFloor = true;
    let destinationFloor = 0;
    while(destinationFloorMatchesCurrentFloor) {
      destinationFloor = Math.floor(Math.random() * Math.floor(this.building.floors));
      if (destinationFloor !== this.currentFloor) {
        destinationFloorMatchesCurrentFloor = false;
      }
    }
    this.destinationFloor = destinationFloor;
    if (destinationFloor > this.currentFloor) {
      this.building.lift.goingUp(this.currentFloor);
    } else {
      this.building.lift.goingDown(this.currentFloor);
    }
    this.state = PersonStates.WaitingForLift;
  }

  waitForLift() {
    if (this.currentFloor === this.building.lift.currentFloor) {
      this.state = PersonStates.GettingInsideLift;
    }
  }

  goIntoLift() {
    const dest = {
      x: this.building.lift.x + (this.building.lift.width / 2),
      y: this.building.lift.y + this.building.lift.height - this.height - this.building.strokeLineWidth
    }
    if (this.destinationReached(dest)) {
      this.state = PersonStates.ChoosingFloor;
      return;
    }
    if (!this.building.lift.isMoving) {
      this.goToPoint(dest.x, dest.y);
    }
  }

  chooseFloor() {
    this.building.lift.goToFloor(this.destinationFloor);
    this.state = PersonStates.WaitingInsideLift;
  }

  waitInsideLift() {
    const destinationReached = !this.building.lift.isMoving && this.currentFloor === this.destinationFloor;
    if (!destinationReached) {
      const bottomOfLift = this.building.lift.y + this.building.lift.height - this.building.strokeLineWidth;
      this.y = bottomOfLift - this.height;
    } else {
      this.state = PersonStates.GoingToWork;
    }
  }

  goToWork() {
    const dest = {
      x: this.building.x + (this.building.width / 2),
      y: this.y
    };
    if (this.destinationReached(dest)) {
      this.state = PersonStates.Working;
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
      this.state = PersonStates.HeadingTowardsLift;
      this.workingTime = 0;
      this.timeWorked = 0;
      return;
    }
    this.timeWorked += 1;
  }

  get currentFloor() {
    const currentY = this.y + this.height;
    const tolerancePixels = 10;
    const match = this.building.floorsYStartPositions
      .findIndex(y => y > currentY - tolerancePixels && y < currentY + tolerancePixels);
    return match;
  }
}
