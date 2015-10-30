"use strict";
var Goal = function(x,y,w,h){
    this.movable = new Movable(x,y);
	this.dims = new Vector(w,h);
    this.width = w;
    this.height = h;
	this.collider = new BoundingBox(this.movable.pos,this.dims);
	this.color = 'rgb(150,150,40)';
}

Goal.prototype.draw = function(){
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.movable.pos.x - this.dims.x / 2,this.movable.pos.y - this.dims.y / 2,this.width,this.height);
    ctx.restore();
}