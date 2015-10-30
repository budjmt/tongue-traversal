var Environment = function(x,y,width,height, fillStyle){
    this.x = x;
    this.y = y;
    
    this.movable = new Movable(x,y);
	this.dims = new Vector(width,height);
	this.collider = new BoundingBox(this.movable.pos,this.dims);
    
    this.width = width;
    this.height = height;
    this.image = fillStyle
}

Environment.prototype.draw = function(){
    ctx.save();
    /*
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x,this.y,this.width,this.height);
    */
    ctx.drawImage(this.image,this.x - this.width / 2,this.y - this.height / 2,this.width,this.height);
    ctx.restore();
}