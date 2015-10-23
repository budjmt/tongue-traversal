var Player = function(initX,initY,WIDTH,HEIGHT,strokeStyle,fillStyle,maxSpeed){
    this.width = WIDTH;
    this.height = HEIGHT;
    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;
    this.health = 6;
    this.movable = new Movable(initX,initY,2,maxSpeed);
    this.alive = true;
	this.forces = [];
    this.forceSum = new Vector(0,0);
}

Player.prototype.calcForces = function(dt) {
		this.forces.push(new Vector(0,9.8 * this.movable.mass));
		//drag
		this.forces.push(this.movable.vel.mult(this.movable.vel.mag() * -0.2 * this.movable.mass));
        this.forceSum = this.forceSum.add(this.movable.vel.mult(this.movable.vel.mag() * -0.2 * this.movable.mass));
        this.forcesum = this.forceSum.add(new Vector(0,9.8 * this.movable.mass));
}

Player.prototype.keyHandler = function() { 
	this.forces = [];
	if (keys[KeyCode.W]||keys[KeyCode.Up]) {
        this.forces.push(new Vector(0,-2000 / dt));
        this.forceSum = this.forceSum.add(new Vector(0,-2000/dt));
    }
    if (keys[KeyCode.S]||keys[KeyCode.Down]) {
        this.forces.push(new Vector(0,2000 / dt));
        this.forceSum = this.forceSum.add(new Vector(0,1000/dt));
    }
    if (keys[KeyCode.A]||keys[KeyCode.Left]) {
        this.forces.push(new Vector(-1000 / dt,0));
        this.forceSum = this.forceSum.add(new Vector(-1000 / dt,0));
    }
    if (keys[KeyCode.D]||keys[KeyCode.Right]) {
        this.forces.push(new Vector(1000 / dt,0));
        this.forceSum = this.forceSum.add(new Vector(1000 / dt,0));
    }
}

Player.prototype.update = function(dt){
    this.move(dt);
    this.draw();
}

Player.prototype.takeDamage = function(damage){
    this.health -= damage;
    if (health <= 0) {
        this.alive = false;
    }
}

Player.prototype.move = function(dt){
    
    if (this.movable.pos.y + this.height > canvas.height-1) {
        this.movable.pos.y = canvas.height-this.height;
        this.movable.accel.y = 0;
        this.movable.vel.y = 0;
    }else{
        //this.movable.accel.y += 15000;
    }
    
	//this.calcForces(dt);
    //this.forceSum = this.forceSum.mult(0.9);
    //this.movable.update(dt,this.forces);
    this.movable.update2(dt,this.forceSum);
    this.forceSum = this.forceSum.mult(0);
	this.forces = [];
}

Player.prototype.draw = function(){
    ctx.save();
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.fillRect(this.movable.pos.x,this.movable.pos.y,this.width,this.height);
    ctx.closePath();
    ctx.restore();
}