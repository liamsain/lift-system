const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");
const entrance = { x: canvas.clientWidth, y: canvas.clientHeight };

class Building {
  constructor() {
    this.x = canvas.width / 100;
    this.y = canvas.height / 100;
    this.width = canvas.width * 0.5;
    this.height = canvas.height * 0.8;
    this.colour = "#000000";
  }
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.colour;
    ctx.fill();
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

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  const building = new Building();
  building.draw();
  drawPeople();
  requestAnimationFrame(draw);
}

draw();