class Lift {
    constructor(x, y, width, height, upperLimit) {
        this.x = x;
        this.y = y - height;
        this.height = height;
        this.width = width;
        this.upperLimit = upperLimit;
        console.log(this);
    }

    draw(ctx) {
        if(this.y > this.upperLimit) {
            this.y -= 1;
        }
        const horizontalCenter = this.x + this.width / 2;
        ctx.moveTo(horizontalCenter, this.y);
        ctx.lineTo(horizontalCenter, this.upperLimit); 
        ctx.rect(this.x, this.y, this.width, this.height);
      }
}