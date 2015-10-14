var canvas, ctx;
var lastFrame;

var tongue;

window.onload = function() {
	canvas = document.querySelector("canvas");
	ctx = canvas.getContext('2d');
	
	lastFrame = +Date.now();
	
	tongue = new Tongue();
	
	update();
}

function update() {
	requestAnimationFrame(update);
	
	var currFrame = +Date.now();
	var dt = currFrame - lastFrame;
	dt /= 1000;
	lastFrame = currFrame;
	
	tongue.update(dt);
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	tongue.draw(ctx);
}

//helper functions
function lerp(a,b,t) {
	return (1 - t) * a + t * b;
}