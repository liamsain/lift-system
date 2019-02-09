
const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");
const peopleCountElement = document.getElementById("people-count-input");
let entities = [];

const building = new Building();
entities.push(building);
const peopleSpawnPoint = { x: building.x + building.height + 20, y: building.y + building.height }

const people = [new Person(peopleSpawnPoint.x, peopleSpawnPoint.y, building)];
entities = [...entities, ...people];
const drawEntities = () => entities.forEach(x => x.draw(ctx));

function draw() {
  if(entities.length - 2 < peopleCountElement.value){
    console.log('adding entitiy');
    entities.push(new Person(peopleSpawnPoint.x, peopleSpawnPoint.y, building));
  } else if(entities.length - 2 > peopleCountElement.value && peopleCountElement.value > 2){
    console.log('removing entity');
     entities.pop();
  }
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  drawEntities();
  requestAnimationFrame(draw);
}
draw();