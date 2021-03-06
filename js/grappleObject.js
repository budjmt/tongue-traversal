var GrappleObject = function(x,y,w,h){
    this.movable = new Movable(x,y);
	this.dims = new Vector(w,h);
	this.collider = new BoundingBox(this.movable.pos,this.dims);
	var r = Math.floor(Math.random() * 220);
	var g = Math.floor(Math.random() * 220);
	var b = Math.floor(Math.random() * 220);
	this.color = 'rgb(' + r + ',' + g + ',' + b + ')';
}

GrappleObject.prototype.draw = function(ctx) {
	ctx.save();
	ctx.fillStyle = this.color;
	ctx.fillRect(this.movable.pos.x - this.dims.x / 2,this.movable.pos.y - this.dims.y / 2
	,this.dims.x,this.dims.y);
	ctx.restore();
}