var Environment = function(x,y,width,height, fillStyle){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillStyle = fillStyle;
}

Environment.prototype.draw = function(){
    ctx.save();
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x,this.y,this.width,this.height);
    ctx.restore();
}