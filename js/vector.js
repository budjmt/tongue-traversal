"use strict";
var Vector = function(initX, initY)
{
	this.x = initX;
	this.y = initY;
}

Vector.prototype.mag = function()
{
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector.prototype.setMag = function(newMag)
{
	var mag = this.mag();
	this.x *= newMag / mag;
	this.y *= newMag / mag;
}

Vector.prototype.normalize = function()
{
	var mag = this.mag();
	if(mag == 0)
		return this.copy();
	return new Vector(this.x / mag, this.y / mag);
}

Vector.prototype.rotate = function(rot) {
	var rotVec = this.copy();
	var c = Math.cos(rot);
	var s = Math.sin(rot);
	rotVec.x = c * this.x - s * this.y;
	rotVec.y = s * this.x + c * this.y;
	return rotVec;
}

Vector.prototype.heading = function() {
	return Math.acos(this.normalize().x);
}

Vector.prototype.add = function(otherVec)
{
	return new Vector(this.x + otherVec.x, this.y + otherVec.y);
}

Vector.prototype.sub = function(otherVec)
{
	return new Vector(this.x - otherVec.x, this.y - otherVec.y);
}

Vector.prototype.mult = function(num)
{
	return new Vector(this.x * num, this.y * num);
}

Vector.prototype.div = function(num)
{
	return new Vector(this.x / num, this.y / num);
}

Vector.prototype.dot = function(otherVec)
{
	return this.x * otherVec.x + this.y * otherVec.y;
}

//random static function ftw
var lerpVector = function(a,b,t) {
	return a.mult(1 - t).add(b.mult(t));
}

Vector.prototype.copy = function()
{
	return new Vector(this.x, this.y);
}

Vector.prototype.toString = function()
{
	return "(" + this.x + ", " + this.y + ")";
}