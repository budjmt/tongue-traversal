var canvas, ctx;

var tongue;

window.onload = function() {
	canvas = document.querySelector("canvas");
	ctx = canvas.getContext('2d');
	
	tongue = new Tongue();
	
	update();
}

function update() {
	requestAnimationFrame(update);
	
	tongue.update();
}