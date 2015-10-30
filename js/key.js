var Key = function(x,y) {
	this.movable = new Movable(x,y);
	this.dims = new Vector(90,100);
	this.collider = new BoundingBox(this.movable.pos,this.dims);
	this.frame = 0;
	this.fps = 1 / 28;
	this.frameTime = 0;
}

Key.prototype.draw = function(ctx, dt) {
	ctx.save();
	ctx.translate(this.movable.pos.x,this.movable.pos.y);
	var offset = (this.dims.x + 1) * this.frame;
	ctx.drawImage(spriteSheet
				, offset, 0, this.dims.x, this.dims.y
				,-this.dims.x / 2,-this.dims.y / 2, this.dims.x / 2, this.dims.y / 2);
	ctx.restore();
	this.frameTime += dt;
	if(this.frameTime > this.fps) {
		this.frame++;
		this.frame %= 9;
		this.frameTime = 0;
	}
}