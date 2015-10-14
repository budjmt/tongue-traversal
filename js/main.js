var canvas, ctx;
var lastFrame, dt;

var tongue;

window.onload = function() {
	canvas = document.querySelector("canvas");
	ctx = canvas.getContext('2d');
	
	lastFrame = +Date.now();
	
	tongue = new Tongue();
	//player = new Player(20,canvas.height-20,20,20,"black","red",1000000000000);
	
	update();
}

function calcDT(){
	var currFrame = +Date.now();
	dt = currFrame - lastFrame;
	dt /= 1000;
	lastFrame = currFrame;
}

function update() {
	requestAnimationFrame(update);
	
	calcDT();
	
	//player and tongue don't play nice atm
	
	//player.update(dt,ctx);
	tongue.update(dt);
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	//player code
	/*ctx.save();
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	ctx.restore();*/
	//tongue code
	tongue.draw(ctx);
}

//helper functions
function lerp(a,b,t) {
	return (1 - t) * a + t * b;
}