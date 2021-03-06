"use strict";
var Movable = function(x, y, mass, maxSpeed) 
{
	mass = mass || 1;
	
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.accel = new Vector(0, 0);
	this.forces = [];
	this.maxSpeed = maxSpeed || 10;
	this.maxForce = 1000000;
    this.mass = mass;
	
	this.debug = undefined;
}

Movable.prototype.calcForces = function (forces)
{
	this.forces = forces.slice(0);
}

Movable.prototype.update = function(dt,forces) {

	this.calcForces(forces);
	while(forces[0]) {
		var force = forces.pop();
		force = force.div(this.mass);
		this.accel = this.accel.add(force);

	}
	this.debug = this.accel;

    this.vel = this.vel.add(this.accel.mult(dt));
	var vel = this.vel.mag();
	
	if (vel > this.maxSpeed) {
		this.vel.setMag(this.maxSpeed);
	}
	this.vel = this.vel.add(new Vector(0,5 / dt * this.mass));
	
	if(vel < 0.05)
		this.vel.mult(0.);

    this.pos = this.pos.add(this.vel.mult(dt));

	this.accel = this.accel.mult(0.);
}

