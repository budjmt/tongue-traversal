var canvas, ctx;
var lastFrame, dt;
var gamePaused;

var player;
var tongue;
var hud;

var grapples = [];

var obstacles = []

window.onload = function() {
	canvas = document.querySelector("canvas");
	ctx = canvas.getContext('2d');
	
	lastFrame = +Date.now();
	gamePaused = false;
	
	/*
	for(var i = 0;i < 10;i++) {
		var x = Math.random() * canvas.width / 3 + canvas.width / 3;
		var y = Math.random() * canvas.width / 4 + canvas.height / 4;
		var w = Math.random() * 100 + 30;
		var h = Math.random() * 100 + 30;
		grapples.push(new GrappleObject(x,y,w,h));
	}*/
	
	var obstacleMap = ["O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O",
					   "O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O",
					   " "," "," "," ","O"," ","O","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
					   " "," "," "," ","O"," ","O","O"," ","O","O"," "," "," "," "," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," ","O","O"," "," ","O"," "," "," "," "," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," ","O","O","O"," ","O","G"," "," "," "," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," ","O","O"," "," ","O","O","O","O","O"," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," ","O","O"," ","O","O"," "," "," "," "," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," ","O","O"," "," "," "," "," "," "," "," "," "," "," ","G"," "," "," "," ",
					   " "," ","O"," ","O"," ","O","O","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," "," ","G"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," ","O","O","O","O"," "," "," ","G","O"," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," ","O","O","O","O"," "," "," "," ","O"," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," ","O","O","O","O"," "," "," "," ","O"," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," ","O","O","O","O"," "," "," "," ","O"," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," ","O","O","O","O"," "," "," "," ","O"," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," ","O"," ","O","O","O","O"," "," "," "," ","O"," "," "," "," "," "," "," "," "," ",
					   " "," ","O"," "," "," ","O","O","O","O"," "," "," "," ","O"," "," "," "," "," "," "," "," "," ",
					   "O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O"
					  ];
	
	var obstacleWidth = 38;
	for(var i = 0; i < 20; i++){
		for(var k = 0; k < 24; k++){
			//debugger;
			if (obstacleMap[(i*24)+k] == "O") {
				obstacles.push(new Environment(k*obstacleWidth,i*obstacleWidth,obstacleWidth,obstacleWidth,"black"));
			}
			else if (obstacleMap[(i*24)+k] == "G") {
				grapples.push(new GrappleObject(k * obstacleWidth, i * obstacleWidth, obstacleWidth, obstacleWidth))
			}
		}
	}
	
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
	
	
	
	hud.update();
	keyUpdate();
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	//player code
	ctx.save();
	var gradient = ctx.createLinearGradient(0,0,0,canvas.height);
    gradient.addColorStop(0,"rgb(240,240,240)");
    gradient.addColorStop(1,"rgb(210,210,210)");
	ctx.save();
	ctx.globalAlpha = 0.7;
	//ctx.clearRect(0,0,canvas.width,canvas.height);
	
    ctx.fillStyle = gradient;
	ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	ctx.restore();
	
	ctx.restore();
	//tongue code
	tongue.draw(ctx);
	player.draw(ctx);
	
	for(var i = 0; i < obstacles.length; i++)
		obstacles[i].draw();
	
	for(var i = 0;i < grapples.length;i++)
		grapples[i].draw(ctx);
	
	hud.updateTongueMeter(tongue);
	hud.draw();
	
}

//helper functions
function lerp(a,b,t) {
	return (1 - t) * a + t * b;
}