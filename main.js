
const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");

let entities = [];

const building = new Building();
entities.push(building);
const peopleSpawnPoint= {x: building.x + building.height + 20, y: building.y + building.height}

const people = [new Person(peopleSpawnPoint.x, peopleSpawnPoint.y, building)];
entities = [...entities, ...people];
const drawEntities = () => entities.forEach(x => x.draw(ctx));
function draw() {
  if(entities.length < 3 && performance.now() > 5000) {
    entities.push(new Person(peopleSpawnPoint.x, peopleSpawnPoint.y, building));
  }
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawEntities();
  requestAnimationFrame(draw);
}

draw();