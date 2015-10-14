var Movable = function(x, y, mass, maxSpeed) 
{
	mass = mass || 1;
	
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.accel = new Vector(0, 0);
	this.maxSpeed = maxSpeed || 10;
    this.mass = mass;
}

Movable.prototype.applyForce = function (force, radianDirection)
{

}

Movable.prototype.update = function(dt){
     
    //this.accel.x = this.force.x / this.mass;
    //this.accel.y = this.force.y / this.mass;

	this.vel = this.vel.mult(0.);
	
    this.vel.x += this.accel.x * dt;
    this.vel.y += this.accel.y * dt;

	if (this.vel.mag > this.maxSpeed) {
		this.vel.setMag(maxSpeed);
	}	
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
}
