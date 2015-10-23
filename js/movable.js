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
	//debugger;
	//this.vel = this.vel.add(new Vector(0,-5 / dt * this.mass));
	this.calcForces(forces);
	while(forces[0]) {
		var force = forces.pop();
		force = force.div(this.mass);/*
		if(force.mag() > this.maxForce)
			force.setMag(this.maxForce);
			*/
		this.accel = this.accel.add(force);
		//console.log(this.accel);
	}
	//debugger;
	//var grav = forces.pop();
	
	this.debug = this.accel;
	//console.log("DONE");
    this.vel = this.vel.add(this.accel.mult(dt));
	var vel = this.vel.mag();
	
	
	if (vel > this.maxSpeed) {
		this.vel.setMag(this.maxSpeed);
	}
	this.vel = this.vel.add(new Vector(0,5 / dt * this.mass));
	
	if(vel < 0.05)
		this.vel.mult(0.);
	
	
	
    this.pos = this.pos.add(this.vel.mult(dt));
	//this.pos = this.pos.add(new Vector(0,5 / dt * this.mass));
	this.accel = this.accel.mult(0.);
}

