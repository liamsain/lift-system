
const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");
let floorInputElement = document.getElementById("lift-floor-input");
let currentFloor = 0;

const building = new Building();
const peopleEntrance = {x: building.x + building.height + 20, y: building.y + building.height}
const people = [new Person(peopleEntrance.x, peopleEntrance.y, building)];


function drawPeople() {
  for(let i = 0; i < people.length; i++){
    people[i].draw(ctx);
  }
}

function updateCurrentFloor(floorNumber) {
  if (Number.isInteger(floorNumber) && floorNumber !== currentFloor) {
    building.lift.goToFloor(floorNumber);
    currentFloor = floorNumber;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  updateCurrentFloor(parseInt(floorInputElement.value));
  building.draw(ctx);
  drawPeople();
  requestAnimationFrame(draw);
}

draw();