
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