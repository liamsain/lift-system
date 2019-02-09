class Building {
  constructor() {
    this.x = canvas.width / 4;
    this.y = canvas.height / 10;
    this.width = canvas.width * 0.5;
    this.height = canvas.height * 0.8;
    this.colour = "#000000";
    this.floorHeight = this.height / 10;
    this.strokeLineWidth = 6;
    this.lift = new Lift(
      this.x + this.strokeLineWidth,
      this.y + this.height,
      this.width / 8,
      this.floorHeight,
      this
    );
    this.entrance = { x: this.x + this.width, y: this.y + this.height - (this.strokeLineWidth / 2) };
    this.init();
  }
  
  init() {
    const floorsYStartPositions = [];
    for (let i = this.height + this.y; i > this.y; i -= this.floorHeight) {
      floorsYStartPositions.push(i);
    }
    this.floorsYStartPositions = floorsYStartPositions;
  }

  drawOutline(ctx) {
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.lineTo(this.x, this.y);
  }

  get floors() {
    return this.height / this.floorHeight;
  }

  drawFloors(ctx) {
    for (let i = this.floorHeight; i < this.height; i += this.floorHeight) {
      ctx.moveTo(this.x + this.lift.width + this.strokeLineWidth, this.y + i);
      ctx.lineTo(this.x + this.width, this.y + i);
    }
  }

  get liftEntranceX() {
    return this.x + this.lift.width;
  }

  draw(ctx) {
    ctx.beginPath();
    this.drawOutline(ctx);
    this.drawFloors(ctx);
    this.lift.draw(ctx);
    ctx.strokeStyle = this.colour;
    ctx.lineWidth = this.strokeLineWidth;
    ctx.stroke();
    ctx.closePath();
  }
}
