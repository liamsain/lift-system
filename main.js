const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");
const peopleHeight = 10;

const buildings = [
  new Building(20, 20, 200, 300),
  new Building(300, 40, 250, 350),
  new Building(600, 30, 150, 270),
  new Building(800, 60, 370, 350),
  new Building(35, 400, 150, 290),
  new Building(220, 430, 320, 350),
  new Building(600, 420, 240, 300),
  new Building(870, 450, 270, 320)
];
/*
 * make loads of buildings!
 *
 * const buildingCount = 200;
for(let i = 0; i < buildingCount; i += 1) {
  let x = 20;
  let y = 20;
  buildings.push(
    new Building(
      
    )
  );
}
*/

let people = [];
buildings.forEach(building => {
  const spawnPoint = {x: building.x + building.width + 10, y: building.y + building.height };
  const peoplePerBuilding = 30;
  const peeps = new Array(peoplePerBuilding)
    .fill({})
    .map(x => new Person(spawnPoint.x, spawnPoint.y, peopleHeight, building));
  people = people.concat(peeps);
});

const entities = [...buildings, ...people];
const drawEntities = () => {
  for (let i = 0; i < entities.length; i += 1) {
    entities[i].draw(ctx);
  }
};

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawEntities();
  requestAnimationFrame(draw);
}
draw();
