var BoundingBox = function(coords,dims) {
	this.coords = coords;//these are both vectors, top left is x and y, naively, so be careful
	this.center = null;
	this.toCorner = null;
	this.dims = dims;//width and height
	this.corners = new Array(4);
	this.normals = new Array(4);
	this.rotation = 0;
	
	//just so everything is set properly
	this.updateCorners();
	this.updateNormals();
}

BoundingBox.prototype.update = function(pos,dims,rot) {
	//basically this can be called in one of three ways:
	//just movable; pos and dims; or pos,dims,rot
	//you can't do pos,rot, it will be recognized as pos,dims
	//so just call as pos,undefined,rot or pos,this.collider.dims,rot
	dims = dims || this.dims;
	rot = rot || this.rotation;
	this.coords = pos;
	this.dims = dims;
	this.rotation = rot;
	this.updateCorners();
	this.updateNormals();
}

BoundingBox.prototype.updateCorners = function() {
	this.toCorner = this.dims.mult(0.5).rotate(this.rotation);
	var toOppositeCorner = new Vector(this.toCorner.x, -this.toCorner.y);
	
	this.center = this.coords.add(this.toCorner);
	//top left
	this.corners[0] = this.center.sub(this.toCorner);
	//top right
	this.corners[1] = this.center.add(toOppositeCorner);
	//bottom right
	this.corners[2] = this.center.add(this.toCorner);
	//bottom left
	this.corners[3] = this.center.sub(toOppositeCorner);
}

BoundingBox.prototype.updateNormals = function() {
	this.normals = [];
	for (var i = 0; i < this.corners.length; i++) {
		var norm = this.corners[i].sub(this.corners[(i + 1) % this.corners.length]);
		this.normals.push(norm.rotate(Math.PI / 2).normalize());
	}
}

BoundingBox.prototype.getMaxMin = function(axis) {
	var maxmin = [ this.corners[0].dot(axis), 1 ];
	for (var i = 1; i < this.corners.length; i++) {
		var proj = this.corners[i].dot(axis);
		if (maxmin[1] > proj)
			maxmin[1] = proj;
		if (proj > maxmin[0])
			maxmin[0] = proj;
	}
	return maxmin;
}

BoundingBox.prototype.intersects = function(other) { 
	//quick circle collision optimization
	if (this.center.sub(other.center).getMag() 
		> Math.max(this.dims.x, this.dims.y) + Math.max(other.dims.x, other.dims.y))
		return false;
	//separating axis theorem
	var axes = this.normals.concat(other.normals);
	for (var i = 0; i < axes.length; i++) {
		var projs = this.getMaxMin(axes[i]); 
		var otherProjs = other.getMaxMin(axes[i]);
		if (projs[0] < otherProjs[1] || otherProjs[0] < projs[1])
			return false;
	}
	return true;
}

BoundingBox.prototype.pointInside = function(x,y) {
	return x > this.coords.x - this.dims.x / 2 && x < this.coords.x + this.dims.x / 2
	&& y > this.coords.y - this.dims.y / 2 && y < this.coords.y + this.dims.y / 2;
}

BoundingBox.prototype.segmentInside = function(start,end) {
	var dir = end.sub(start);
	var t0 = 0;
	var t1 = 1;
	//dir = dir.normalize();
	var invdir = new Vector(1 / dir.x, 1 / dir.y);
	var topleft = this.coords.sub(this.dims.mult(0.5)), botright = this.coords.add(this.dims.mult(0.5));
	var tmin = new Vector(0,0), tmax = new Vector(0,0);
	tmin = topleft.sub(start); tmin.x *= invdir.x; tmin.y *= invdir.y;
	tmax = botright.sub(start); tmax.x *= invdir.x; tmax.y *= invdir.y;
	if(dir.x < 0) {	tmin.x ^= tmax.x; tmax.x ^= tmin.x; tmin.x ^= tmax.x; }
	if(dir.y > 0) {	tmin.y ^= tmax.y; tmax.y ^= tmin.y; tmin.y ^= tmax.y; }
	tmin = Math.min(tmin.x,tmin.y);
	tmax = Math.max(tmax.x,tmax.y);
	if (tmax <= t1 && tmin >= t0) {
		console.log(t0 + ', ' + t1 + ' | ' + tmin + ', ' + tmax);
		var t = (tmin + tmax) / 2;
		return start.add(dir.mult(t));
	}
	return undefined;
}

BoundingBox.prototype.basicIntersect = function(other) {
	/*
	console.log("Other coords: " + other.coords);
	console.log("Other dims: " + other.dims);
	console.log("This coords: " + this.coords);
	console.log("This dims: " + this.dims);
	*/
	return !(other.coords.x > this.coords.x + this.dims.x || 
        other.coords.x + other.dims.x < this.coords.x || 
        other.coords.y > this.coords.y + this.dims.y ||
        other.coords.y + other.dims.y < this.coords.y);
}

BoundingBox.prototype.getArea = function() {
	return this.dims.x * this.dims.y;
}

BoundingBox.prototype.copy = function()
{
	return new BoundingBox(this.coords, this.dims);
}