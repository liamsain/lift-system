const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");
const entrance = { x: canvas.clientWidth, y: canvas.clientHeight };

class Building {
  constructor() {
    this.x = canvas.width / 4;
    this.y = canvas.height / 10;
    this.width = canvas.width * 0.5;
    this.height = canvas.height * 0.8;
    this.colour = "#000000";
    this.floorHeight = this.height / 10;
    this.strokeLineWidth = 7;
    this.liftWidth = this.width / 8;
    this.liftHeight = this.floorHeight; 
    this.liftX = this.x + this.strokeLineWidth;
    this.liftY = (this.y + this.height) - this.liftHeight - this.strokeLineWidth;
  }
  drawOutline(ctx) {
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.lineTo(this.x, this.y);
  }

  drawFloors(ctx) {
    for(let i = 0; i < this.height; i += this.floorHeight){
      ctx.moveTo(this.x + this.liftWidth + this.strokeLineWidth, this.y + i);
      ctx.lineTo(this.x + this.width, this.y + i);
    }
  }

  drawLift(ctx) {
    if(this.liftY > this.y) {
      this.liftY -= 1;

    }
    const liftCenterTopX = this.liftX + this.liftWidth / 2;
    ctx.moveTo(liftCenterTopX, this.liftY);
    ctx.lineTo(liftCenterTopX, this.y); 
    ctx.rect(this.liftX, this.liftY, this.liftWidth, this.liftHeight);
  }

  draw(ctx) {
    ctx.beginPath();
    this.drawOutline(ctx);
    this.drawFloors(ctx);
    this.drawLift(ctx);
    ctx.strokeStyle = this.colour;
    ctx.lineWidth = this.strokeLineWidth;
    ctx.stroke();
    ctx.closePath();
  }
}

class Person {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 15;
    this.colour = "#3dc92e";
    this.whatever = 5;
  };

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.colour;
    ctx.fill();
    ctx.closePath();
  }
  
}
const people = [new Person(canvas.width / 2, canvas.height / 2)];
function drawPeople() {
  for(let i = 0; i < people.length; i++){
    people[i].draw(ctx);
  }
}
let building = new Building();

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  building.draw(ctx);
  drawPeople();
  requestAnimationFrame(draw);
}

draw();