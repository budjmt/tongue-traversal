var canvas, ctx;
var timeNow = Date.now();
var timePrev = 0;
var dt;
var tongue;

window.onload = function() {
	canvas = document.querySelector("canvas");
	ctx = canvas.getContext('2d');
	
	tongue = new Tongue();
	player = new Player(20,canvas.height-20,20,20,"black","red",1000000000000);
	
	update();
}

function calcDT(){
	timePrev = timeNow;
	timeNow = Date.now();
	dt = timeNow-timePrev;
	dt /= 1000;
}
function update() {
	requestAnimationFrame(update);
	
	calcDT();
	
	ctx.save();
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	ctx.restore();
	
	player.update(dt,ctx);
	//tongue.update();
}