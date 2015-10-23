var canvas, ctx;
var lastFrame, dt;
var gamePaused;

var player;
var tongue;
var hud;

window.onload = function() {
	canvas = document.querySelector("canvas");
	ctx = canvas.getContext('2d');
	
	lastFrame = +Date.now();
	gamePaused = false;
	
	player = new Player(20,canvas.height-20,20,20,"black","red",10000000000000000000);
	tongue = new Tongue();
	hud = new HUD("black","black");
	update();
}

function updateDeltaTime(){
	var currFrame = +Date.now();
	dt = currFrame - lastFrame;
	dt /= 1000;
	lastFrame = currFrame;
}

function update() {
	requestAnimationFrame(update);
	
	updateDeltaTime();
	
	player.update(dt,ctx);
	tongue.update(dt);
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	hud.update();
	keyUpdate();
	
	//player code
	ctx.save();
	var gradient = ctx.createLinearGradient(0,0,0,canvas.height);
    gradient.addColorStop(0,"rgb(240,240,240)");
    gradient.addColorStop(1,"rgb(210,210,210)");
    ctx.fillStyle = gradient;
	ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	ctx.restore();
	//tongue code
	tongue.draw(ctx);
	player.draw(ctx);
	
	hud.updateTongueMeter(tongue);
	hud.draw();
	
}

//helper functions
function lerp(a,b,t) {
	return (1 - t) * a + t * b;
}