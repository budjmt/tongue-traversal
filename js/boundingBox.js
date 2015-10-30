"use strict";
function BoundingBox(coords,dims) {
	this.coords = coords;//these are both vectors, center is x and y
	this.toCorner = null;
	this.dims = dims;//width and height
	this.corners = new Array(4);
	this.normals = new Array(4);
	this.rotation = 0;
	
	this.updateCorners();
	this.updateNormals();
}

BoundingBox.prototype.update = function(pos,dims,rot) {
	//basically this can be called in one of three ways:
	//just movable; pos and dims; or pos,dims,rot
	//you can't do pos,rot, it will be recognized as pos,dims
	//so just call as pos,undefined,rot or pos,this.collider.dims,rot
	dims = dims || this.dims;
	if(rot != 0)
		rot = rot || this.rotation;
	this.coords = pos;
	this.dims = dims;
	this.rotation = rot;
	this.updateCorners();
	this.updateNormals();
};

BoundingBox.prototype.updateCorners = function() {
	this.toCorner = this.dims.mult(0.5).rotate(this.rotation);
	var toOppositeCorner = new Vector(this.toCorner.x, -this.toCorner.y);
	
	//top left
	this.corners[0] = this.coords.sub(this.toCorner);
	//top right
	this.corners[1] = this.coords.add(toOppositeCorner);
	//bottom right
	this.corners[2] = this.coords.add(this.toCorner);
	//bottom left
	this.corners[3] = this.coords.sub(toOppositeCorner);
};

BoundingBox.prototype.updateNormals = function() {
	this.normals = [];
	for (var i = 0; i < this.corners.length; i++) {
		var norm = this.corners[i].sub(this.corners[(i + 1) % this.corners.length]);
		this.normals.push(norm.rotate(Math.PI / 2).normalize());
	}
}

BoundingBox.prototype.getMaxMin = function(axis) {
	var maxmin = { max : this.corners[0].dot(axis), min: 1 };
	for (var i = 1; i < this.corners.length; i++) {
		var proj = this.corners[i].dot(axis);
		if (proj < maxmin.min)
			maxmin.min = proj;
		if (proj > maxmin.max)
			maxmin.max = proj;
	}
	return maxmin;
}

BoundingBox.prototype.getSupportPoint = function(dir) {
	var support = { point : this.corners[0], proj: this.corners[0].dot(dir) };
	for (var i = 1; i < this.corners.length; i++) {
		var proj = this.corners[i].dot(dir);
		if (proj > support.proj) {
			support.point = this.corners[i];
			support.proj = proj;
		}
	}
	return support;
}	

//returns the normal and vertex with the greatest penetration,
//this can be the minimum axis of penetration (confusingly enough)
//the reasoning is that if the value is negative, there is penetration,
//so the greatest NEGATIVE value has the least penetration
//if the value is positive, then there is no penetration i.e. there is a separating axis
BoundingBox.prototype.getAxisMinPen = function(other) {
	var axis = { originator: this
	, norm: undefined, vert: undefined
	, pen: Number.NEGATIVE_INFINITY };
	for(var i = 0; i < this.normals.length; i++) {
		var norm = this.normals[i];
		var support = other.getSupportPoint(norm.mult(-1));
		var vert = this.corners[i];
		
		var pen = norm.dot(support.point.sub(vert));
		if(pen > axis.pen) {
			axis.norm = norm;
			axis.vert = vert;
			axis.pen = pen;
		}
	}
	return axis;
}

BoundingBox.prototype.intersects = function(other) {
	//quick circle collision optimization
	if (this.coords.sub(other.coords).mag() 
		> Math.max(this.dims.x, this.dims.y) + Math.max(other.dims.x, other.dims.y))
		return false;
	
	//separating axis theorem NEW IMPLEMENTATION
	//this contains the collision data
	var manifold = undefined;
	
	var minAxis = this.getAxisMinPen(other);
	if(minAxis.pen > 0)
		return manifold;
   
	var otherMinAxis = other.getAxisMinPen(this);
	//this may be unnecessary
	if (otherMinAxis.pen > 0)
		return manifold;
	
	manifold = (minAxis.pen > otherMinAxis.pen) ? minAxis : otherMinAxis;
	//console.log(manifold.pen);
	return manifold;
}

BoundingBox.prototype.intersectsMaxMin = function(other) { 
	//quick circle collision optimization
	if (this.coords.sub(other.coords).mag() 
		> Math.max(this.dims.x, this.dims.y) + Math.max(other.dims.x, other.dims.y))
		return false;
	//separating axis theorem
	var axes = this.normals.concat(other.normals);
	for (var i = 0; i < axes.length; i++) {
		var projs = this.getMaxMin(axes[i]); 
		var otherProjs = other.getMaxMin(axes[i]);
		if (projs.max < otherProjs.min || otherProjs.max < projs.min)
			return false;
	}
	return true;
}

BoundingBox.prototype.pointInside = function(x,y) {
	//doesn't account for rotation
	return !(x < this.coords.x - this.dims.x / 2 || x > this.coords.x + this.dims.x / 2
	|| y < this.coords.y - this.dims.y / 2 || y > this.coords.y + this.dims.y / 2);
};

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
//doesn't account for rotation
	return !(other.coords.x > this.coords.x + this.dims.x / 2 || 
          other.coords.x + other.dims.x / 2 < this.coords.x || 
          other.coords.y > this.coords.y + this.dims.y / 2 ||
          other.coords.y + other.dims.y / 2 < this.coords.y);
}

BoundingBox.prototype.getArea = function() {
	return this.dims.x * this.dims.y;
};

BoundingBox.prototype.copy = function()
{
	return new BoundingBox(this.coords, this.dims);
};

BoundingBox.prototype.debug = function(ctx,cx,cy) {
	ctx.save();
	ctx.strokeStyle = 'yellow';
	ctx.lineWidth = 3;
	var sx = worldToScreen(this.coords.x,cx,ctx.canvas.width);
	var sy = worldToScreen(this.coords.y,cy,ctx.canvas.height);
	ctx.translate(sx,sy);
	ctx.rotate(this.rotation);
	ctx.strokeRect(-this.dims.x / 2,-this.dims.y / 2,this.dims.x,this.dims.y);
	ctx.fillStyle = 'yellow';
	ctx.globalAlpha = 0.2;
	ctx.fillRect(-this.dims.x / 2,-this.dims.y / 2,this.dims.x,this.dims.y);
	ctx.restore();
}