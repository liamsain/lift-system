
const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");
let floorInputElement = document.getElementById("lift-floor-input");

const people = [new Person(canvas.width / 2, canvas.height / 2)];
const building = new Building();

function drawPeople() {
  for(let i = 0; i < people.length; i++){
    people[i].draw(ctx);
  }
}


function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  building.draw(ctx);
  drawPeople();
  requestAnimationFrame(draw);
}

draw();