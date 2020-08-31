const LiftStates = {
  Idle: 'idle',
  GettingRequester: 'gettingRequester',
  WaitingAtDestination: 'waitingAtDestination',
  Delivering: 'delivering',
  DeliveringRequester: 'deliveringRequester'
};


class Lift {
  constructor(x, y, width, height, building) {
    this.x = x;
    this.y = y - height;
    this.building = building;
    this.height = height;
    this.width = width;
    this.speed = 0.5;
    this.destinations = [];
    this.requests = [];
    this.direction = Directions.Up;
    this.waitingTime = 100;
    this.waitedFor = 0;
    this.state = LiftStates.Idle;
    this.isMoving = false;
  }

  draw(ctx) {
    this.update();
    // draw lift line
    const horizontalCenter = this.x + this.width / 2;
    ctx.moveTo(horizontalCenter, this.y);
    ctx.lineTo(horizontalCenter, this.building.y);

    // draw lift box
    const rightX = this.x + this.width + (this.building.strokeLineWidth / 2);
    const leftX = this.x - (this.building.strokeLineWidth / 2);

    if (this.isMoving || this.state === LiftStates.Idle) {
      ctx.rect(leftX, this.y, this.width + (this.building.strokeLineWidth / 2), this.height);
    }  else {
      ctx.moveTo(rightX, this.y + this.height / 4);
      ctx.lineTo(rightX, this.y );
      ctx.lineTo(leftX, this.y);
      ctx.lineTo(leftX, this.y + this.height);
      ctx.lineTo(rightX, this.y + this.height);
    }
  }

  get currentFloor() {
    if (this.isMoving)
      return undefined;
    const match = this.building.floorsYStartPositions.findIndex(y => y === this.y + this.height);
    return match;
  }

  update() {
    if (this.state === LiftStates.Idle) {
      if (this.requests.length > 0) {
        this.destinations = [this.requests[0].floorNumber];
        this.state = LiftStates.GettingRequester;
      }
    } else if (this.state === LiftStates.GettingRequester) {
      this.getRequester();
    } else if (this.state === LiftStates.WaitingAtDestination) {
      this.waitForInstruction();
    } else if (this.state === LiftStates.Delivering) {
      this.deliverLiftOccupants();
    }
  }

  getRequester() {
    const requesterFloorNumber = this.requests[0].floorNumber;
    const requesterAtTopFloor = requesterFloorNumber === this.building.floors - 1;
    const requesterAtBottomFloor = requesterFloorNumber === 0;
    // if requester is at top or bottom, be available to requesters who are between you and requester
    // AND want to travel in the same direction that you are travelling in
    const floorsBetweenRequesterAndHere = this.getFloorNumbersBetweenCurrentLocationAndFloorNumber(requesterFloorNumber);
    if (requesterAtTopFloor) {
      if (floorsBetweenRequesterAndHere.length) {
        const relevantRequesterFloors = this.requests
          .filter(request => floorsBetweenRequesterAndHere.includes(request.floorNumber) 
            && request.direction === Directions.Up)
          .map(request => request.floorNumber)
          .sort((a, b) => a - b);
        relevantRequesterFloors.push(requesterFloorNumber);
        this.destinations = relevantRequesterFloors
          .filter((item, index) => relevantRequesterFloors.indexOf(item) === index)
      }
    } else if (requesterAtBottomFloor) {
      if (floorsBetweenRequesterAndHere.length) {
         const relevantRequesterFloors = this.requests
          .filter(request => floorsBetweenRequesterAndHere.includes(request.floorNumber) 
            && request.direction === Directions.Down)
          .map(request => request.floorNumber)
          .sort((a, b) => b - a);
        relevantRequesterFloors.push(requesterFloorNumber);
        this.destinations = relevantRequesterFloors
          .filter((item, index) => relevantRequesterFloors.indexOf(item) === index)
      }
    }

    if (this.currentFloor && this.currentFloor !== this.destinations[0]) {
      this.isMoving = true;
      const destinationY = this.getYValueFromFloorNumber(requesterFloorNumber);
      if (this.y > destinationY) {
        this.y -= this.speed;
      } else {
        this.y += this.speed;
      }
    } else {
      this.isMoving = false;
      this.direction = this.requests[0].direction;
      this.requests = this.requests
        .filter(request => request.floorNumber !== this.requests[0].floorNumber && request.direction !== this.requests[0].direction);
      this.destinations.shift();
      this.state = LiftStates.WaitingAtDestination;
    }
  }

  waitForInstruction() {
  // people are getting in and pressing numbers
    if (this.waitedFor >= this.waitingTime) {
      if (this.destinations.length) {
        if (this.direction === Directions.Up) {
          this.destinations = this.destinations.sort((a, b) => a - b);
        } else {
          this.destinations = this.destinations.sort((a, b) => b - a);
        }
        this.state = LiftStates.Delivering;
      } else {
        this.state = LiftStates.Idle;
      }
      this.waitedFor = 0;
    }
    this.waitedFor += 1;
  }

  deliverLiftOccupants() {
    const destinationFloor = this.destinations[0];
    const groundFloorY = this.building.y + this.building.height - this.height;
    const distanceToTravel = destinationFloor * this.height;
    const destY = groundFloorY - distanceToTravel;
    if (this.y !== destY) {
      this.isMoving = true;
      if (this.direction === Directions.Up) {
        this.y -= this.speed;
      } else {
        this.y += this.speed;
      }
    } else {
      this.isMoving = false;
      this.destinations = this.destinations.filter(x => x !== destinationFloor);
      if (this.destinations.length) {
        this.state = LiftStates.WaitingAtDestination;
      } else {
        this.state = LiftStates.Idle;
      }
    }
   
  }

  getFloorNumbersBetweenCurrentLocationAndFloorNumber(floorNumber) {
    let floors = [];
    const floorNumberYValue = this.getYValueFromFloorNumber(floorNumber);
    const currentYLocation = this.y + this.height;
    if (floorNumberYValue === currentYLocation) {
      return floors;
    }
    const floorNumberYIsMoreThanCurrentY = this.building.floorNumbersWithYCoords
      .find(floor => floor.number === floorNumber).y > currentYLocation;
    if (floorNumberYIsMoreThanCurrentY) {
      floors = this.building.floorNumbersWithYCoords
        .filter(floor => floor.y >= this.y && floor.y <= floorNumberYValue)
    } else {
      floors = this.building.floorNumbersWithYCoords
        .filter(floor => floor.y <= this.y && floor.y >= floorNumberYValue)
    }
    return floors.map(floor => floor.number);
  }

  getYValueFromFloorNumber(floorNumber) {
    const groundFloorY = this.building.y + this.building.height;
    const distanceToTravel = floorNumber * this.height;
    return groundFloorY - distanceToTravel;
  }

  goToFloor(number) {
    if (!this.destinations.includes(number)) {
      this.destinations.push(number);
    } 
  }
  goingUp(floorNumber) {
    this.requests.push({
      floorNumber,
      direction: Directions.Up
    });
    console.log(this.requests);
  }
  goingDown(floorNumber) {
    this.requests.push({
      floorNumber,
      direction: Directions.Down
    });

    console.log(this.requests);
  }

}
