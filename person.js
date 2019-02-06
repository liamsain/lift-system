const initialState = {
  inBuilding: false,
  inLift: false,
  isWorking: false
};
class Person {
  constructor(x, y, building) {
    this.height = 15;
    this.x = x;
    this.y = y - this.height;
    this.building = building;
    this.inBuilding = false;
    this.width = 10;
    this.colour = "#3dc92e";
    this.whatever = 5;
    this.state = initialState;
    this.speed = 1;
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

  goToBuildingEntrance() {
    const destX = this.building.entrance.x;
    const destY = this.building.entrance.y - this.height;
    this.state.inBuilding =
      this.x === destX  &&
      this.y === destY 
    if (this.state.inBuilding) {
      return;
    }
    this.goToPoint(destX, destY);
  }

  goToLift() {
    const destX = this.building.lift.x + this.building.lift.width / 2;
    const destY = this.building.lift.y + this.building.lift.height - this.height;
    this.state.inLift = this.x === destX && this.y === destY;
    if (this.state.inLift) {
      return;
    }
    this.goToPoint(destX, destY);
  }

  update() {
    if (!this.state.inBuilding) {
      this.goToBuildingEntrance();
    } else if (!this.state.inLift) {
      this.goToLift();
    } else if (this.state.inBuilding && this.state.inLift) {
      this.building.lift.goToFloor(5);
      this.y = this.building.lift.y + this.building.lift.height - this.height;
    }
  }
}
