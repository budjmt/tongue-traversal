var Player = function(initX,initY,WIDTH,HEIGHT,strokeStyle,fillStyle,maxSpeed){
    this.width = WIDTH;
    this.height = HEIGHT;
    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;

    this.movable = new Movable(initX,initY,maxSpeed);
}

Player.prototype.update = function(dt){
    this.move(dt);
    this.draw();
}

Player.prototype.move = function(dt){
    
    this.movable.accel.x = 0;
	this.movable.accel.y = 0;
    
    if (this.movable.pos.y + this.height > canvas.height-1) {
        this.movable.pos.y = canvas.height-this.height;
        this.movable.accel.y = 0;
        this.movable.vel.y = 0;
    }else{
        this.movable.accel.y += 15000;
    }
    
    if (keys[KeyCode.W||keys[KeyCode.Up]]) {
        this.movable.accel.y = -20000;
    }
    if (keys[KeyCode.S||keys[KeyCode.Down]]) {
        this.movable.accel.y = 10000;
    }
    if (keys[KeyCode.A||keys[KeyCode.Left]]) {
        this.movable.accel.x = -10000;
    }
    if (keys[KeyCode.D||keys[KeyCode.Right]]) {
        this.movable.accel.x = 10000;
    }
    
    this.movable.update(dt);
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