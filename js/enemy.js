var Enemy = function(initX,initY,WIDTH,HEIGHT,strokeStyle,fillStyle,maxSpeed){
    this.width = WIDTH;
    this.height = HEIGHT;
    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;
    this.movable = Movable(initX,initY,0,maxSpeed);
}

Enemy.prototype.move = function(){
    
}

Enemy.prototype.draw = function(ctx){
    ctx.save();
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.fillRect(this.pos.x,this.pos.y,this.width,this.height);
    ctx.closePath();
}