"use strict";

var canvas, ctx;
var lastFrame, dt;
var gamePaused;

var player;
var tongue;
var key;
var hud;

var textures = Object.seal({
	obstacle: new Image(),
	goal: new Image(),
	grapple: new Image(),
});

var grapples = [];
var obstacles = [];
var goals = [];

var GAME_STATE = Object.freeze({
	BEGIN:0,
	PLAYING:1,
	FINISHED:2,
});

var state;
var canWin;
var animFrame;
var image;
var spriteSheet;

var exhaust;
var soundEffect;

window.onblur = function(){
	gamePaused = true;
	window.cancelAnimationFrame(animFrame);
	update();
}

window.onfocus = function(){
	gamePaused = false;
	window.cancelAnimationFrame(animFrame);
	update();
}

window.onload = function() {
	canvas = document.querySelector("canvas");
	ctx = canvas.getContext('2d');
	canWin = false;
	
	soundEffect = document.getElementById("keySound");
	
	lastFrame = +Date.now();
	gamePaused = false;

	exhaust = new Emitter();
	this.exhaust = new this.Emitter();
	this.exhaust.numParticles = 1000;
	this.exhaust.red = 150;
	this.exhaust.green = 150;
	this.exhaust.blue = 150;
	this.exhaust.createParticles({x:100,y:100});
	
	
	image = document.getElementById("obstacleImg");
	spriteSheet = document.getElementById("keyImg");

	var pattern = ctx.createPattern(image,"no-repeat")
	
	state = GAME_STATE.BEGIN;
	
	var obstacleMap = ["O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O",
					   "O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O",
					   "O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O",
					   "O","G"," "," "," "," "," ","O","O","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","G","E",
					   "O"," "," "," "," "," "," ","O","O"," "," ","O","O","O","K"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","E",
					   "O"," "," ","O","O"," "," ","O","O"," ","O","O","O","O"," "," "," ","G"," "," "," "," "," "," "," "," "," "," "," "," ","E",
					   "O"," "," ","O","O"," "," ","O","O"," "," ","O","O","O","G"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","E",
					   "O"," "," ","O","O","G"," ","O","O","O"," ","O","O","O","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","O",
					   "O"," ","G","O","O"," "," ","O","O"," "," ","O","O","O","O"," "," "," "," ","G"," "," "," "," "," "," "," "," "," "," ","O",
					   "O"," "," ","O","O"," "," ","O","O"," ","O","O","O","O","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","O",
					   "O"," "," ","O","O"," "," ","G"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","O",
					   "O"," "," ","O","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","G"," "," ","O",
					   "O"," "," ","O","O"," "," ","O","O","O"," "," "," ","G","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","G","O",
					   "O"," "," ","O","O"," "," ","O","O","O"," "," "," "," ","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","O",
					   "O"," "," ","O","O"," "," ","O","O","O"," "," "," "," ","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","O",
					   "O"," "," ","O","O"," "," ","O","O","O"," "," "," "," ","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","O",
					   "O"," "," ","O","O"," "," ","O","O","O"," "," "," "," ","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","O",
					   "O"," "," ","O","O"," "," ","G"," "," "," "," "," "," ","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","O",
					   "O"," "," ","O","O"," "," "," "," "," "," "," "," "," ","O"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","O",
					   "O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O"
					   ];
	
	var obstWidth = canvas.width/31;
	var obstHeight = canvas.height/20;
	for(var i = 0; i < 20; i++){
		for(var k = 0; k < 31; k++){
			if (obstacleMap[(i*31)+k] == "O") {
				obstacles.push(new Environment(k*obstWidth,i*obstHeight,obstWidth,obstHeight,image));
			}else if (obstacleMap[(i*31)+k] == "G") {
				grapples.push(new GrappleObject(k * obstWidth, i * obstHeight, obstWidth, obstHeight))
			}else if (obstacleMap[(i*31)+k] == "E") {
				goals.push(new Goal(k * obstWidth, i * obstHeight, obstWidth, obstHeight));
			}else if (obstacleMap[(i*31)+k] == "K") {
				key = new Key(k * obstWidth,i * obstHeight);
			}
		}
	}
	
	player = new Player(20,canvas.height-100,20,20,"black","red",10000000000000000000);
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

function playing(){
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

	ctx.fillStyle = gradient;
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.restore();
	
	ctx.restore();
	//tongue code
	tongue.draw(ctx);
	player.draw(ctx);
	
	for(var i = 0; i < obstacles.length; i++)
		obstacles[i].draw();
	
	for(var i = 0;i < grapples.length;i++)
		grapples[i].draw(ctx);
	
	for(var i = 0;i < goals.length; i++){
		
		goals[i].draw();
	}
	if (!canWin) {
		key.draw(ctx,dt);
	}
	hud.updateTongueMeter(tongue);
	hud.draw();
}

function startScreen(){
	ctx.save();
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	ctx.shadowBlur = 80;
    ctx.shadowColor = "rgba(180,180,180,0.75)";
	
	ctx.font = "100px sans-serif";
	ctx.fillStyle = "white";
	var textWidth = ctx.measureText("Tongue Traversal").width;
	ctx.fillText("Tongue Traversal",canvas.width/2 - textWidth/2,canvas.height/2 - 40);
	
	ctx.font = "60px sans-serif";
	ctx.fillStyle = "gray";
	var textWidth = ctx.measureText("Click Anywhere to Begin").width;
	ctx.fillText("Click Anywhere to Begin",canvas.width/2 - textWidth/2,canvas.height/2 + 80);
	
	ctx.font = "30px sans-serif";
	ctx.fillStyle = "#CCC";
	var textWidth = ctx.measureText("WASD/Arrow Keys to move player").width;
	ctx.fillText("WASD/Arrow Keys to move player",canvas.width/2 - textWidth/2,canvas.height/2 + 160);
	
	ctx.font = "30px sans-serif";
	ctx.fillStyle = "#CCC";
	var textWidth = ctx.measureText("Click and move for tongue").width;
	ctx.fillText("Click and move for tongue",canvas.width/2 - textWidth/2,canvas.height/2 + 200);
	
	ctx.font = "20px sans-serif";
	ctx.fillStyle = "rgb(220,220,220)";
	var textWidth = ctx.measureText("Created By: Michael Cohen and John Park").width;
	ctx.fillText("Created By: Michael Cohen and John Park",20,canvas.height - 20);
	ctx.restore();
}

function finished(){
	ctx.save();
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	ctx.shadowBlur = 80;
    ctx.shadowColor = "rgba(180,180,180,0.75)";
	
	ctx.font = "100px sans-serif";
	ctx.fillStyle = "white";
	var textWidth = ctx.measureText("YOU WON!").width;
	ctx.fillText("YOU WON!",canvas.width/2 - textWidth/2,canvas.height/2 - 40);
	
	ctx.font = "60px sans-serif";
	ctx.fillStyle = "gray";
	var textWidth = ctx.measureText("Click Anywhere to Restart").width;
	ctx.fillText("Click Anywhere to Restart",canvas.width/2 - textWidth/2,canvas.height/2 + 80);
	
	window.onload();
	ctx.restore();
}

function update() {
	animFrame = requestAnimationFrame(update);
	
	if (gamePaused) {
		console.log("paused");
		return;
	}
	
	if (state == GAME_STATE.BEGIN) {
		startScreen();
	}else if (state == GAME_STATE.PLAYING) {		
		playing();
	}else if (state == GAME_STATE.FINISHED) {
		finished();
	}
	if (!tongue.canExtend && tongue.retracting) {
		exhaust.updateAndDraw(ctx,{x:player.movable.pos.x,y:player.movable.pos.y})
	}
	
}

//helper functions
function lerp(a,b,t) {
	return (1 - t) * a + t * b;
}