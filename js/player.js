var Player = function(initX,initY,WIDTH,HEIGHT,strokeStyle,fillStyle,maxSpeed){
    this.width = WIDTH;
    this.height = HEIGHT;
    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;
    this.health = 6;
    this.movable = new Movable(initX,initY,1,maxSpeed);
    this.alive = true;
	this.forces = [];
	this.jumping = false;
	this.jumpTime = 0;
	this.falling = false;
}

Player.prototype.calcForces = function(dt) {
		this.forces = [];
		this.forces.push(new Vector(0,9.8 / dt * this.movable.mass));//this is super lazy lol
		this.keyForces(dt);
		//drag
		var vel = this.movable.vel.mag();
		var dir = this.movable.vel.normalize();
		this.forces.push(dir.mult(vel * vel * -0.15 * this.movable.mass));
}

Player.prototype.keyHandler = function() { 
}

Player.prototype.keyForces = function(dt) {
	var moveForce = 5000;
	if (!this.falling && (keys[KeyCode.W]||keys[KeyCode.Up])) {
        this.forces.push(new Vector(0,-moveForce * this.movable.mass));
		this.jumping = true;
		this.jumpTime += dt;
		if(this.jumpTime >= 0.5)
			this.falling = true;
    }
	else if(this.jumping)
		this.falling = true;
    if (keys[KeyCode.S]||keys[KeyCode.Down]) {
        this.forces.push(new Vector(0,moveForce * this.movable.mass));
    }
    if (keys[KeyCode.A]||keys[KeyCode.Left]) {
        this.forces.push(new Vector(-moveForce / 2 * this.movable.mass,0));
    }
    if (keys[KeyCode.D]||keys[KeyCode.Right]) {
        this.forces.push(new Vector(moveForce / 2* this.movable.mass,0));
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
		this.jumping = false;
		this.jumpTime = 0;
		this.falling = false;
    }else{
        //this.movable.accel.y += 15000;
    }
    
	this.calcForces(dt);
    this.movable.update(dt,this.forces);
	this.forces = [];
}

Player.prototype.draw = function(){
    ctx.save();
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.fillRect(this.movable.pos.x,this.movable.pos.y,this.width,this.height);
	
	ctx.translate(this.movable.pos.x + this.width / 2,this.movable.pos.y + this.height / 2);
	ctx.strokeStyle = 'cyan';
	ctx.moveTo(0,0);
	ctx.lineTo(this.movable.vel.x,this.movable.vel.y);
	ctx.stroke();
	
	ctx.strokeStyle = '#f0f';
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(this.movable.debug.x,this.movable.debug.y);
	ctx.stroke();
    ctx.closePath();
    ctx.restore();
}