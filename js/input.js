//  Keyboard input
var keys = {};
var oldKeys = {};

var KeyCode = Object.freeze({
	W:87,
	A:65,
	S:83,
	D:68,
	Up:38,
	Left:37,
	Down:40,
	Right:39,
	Shift:16,
	P:80,
	G:71,
	K:75
});


addEventListener("keydown", function (e) 
{
   	keys[e.keyCode] = true;
	input();
});

addEventListener("keyup", function (e) 
{
    keys[e.keyCode] = false;
	input();
});

function keyUpdate(){
	oldKeys = {};
	for (var property in keys) {
		oldKeys[property] = keys[property];
	}
}

addEventListener("mousedown",function(e) {
	if(e.which != 1)
		return;
	if(gamePaused) {
		resumeGame();
		return;
	}
	if(tongue.canExtend && !tongue.extending){
		var mouse = new Vector(0, 0);
		mouse.x = e.pageX - e.target.offsetLeft;
		mouse.y = e.pageY - e.target.offsetTop;
		tongue.extending = true;
		tongue.currSegment = new Segment(0,0,1);
		tongue.currSegment.start = player.movable.pos.add(new Vector(player.width / 2, player.height / 2));
		tongue.mouse = mouse;
		//tongue.currSegment.end = tongue.currSegment.start.copy();
		tongue.currSegment.end = tongue.mouse;
		
		//Subtracs initial tongue length from the meter
		tongue.MeterLength -= tongue.currSegment.length();
	}
});

addEventListener("mousemove",function(e) {
	var mouse = new Vector(0, 0);
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	
	if(tongue.extending && tongue.canExtend) {
		tongue.mouse = mouse;
	}
});

function input() {
	gameKeyHandler();
	if(gamePaused)
		return;
	player.keyHandler();
}

function gameKeyHandler() {
	//Debug level-reset key: K
	if(keys[KeyCode.K]) {
		resetLevel();
	}

	if (keys[KeyCode.P]) {    //p
		gamePaused = !gamePaused;
		//(gamePaused) ? pauseGame() : resumeGame();
	}	
}