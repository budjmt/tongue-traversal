//  Keyboard input
var keys = {};
var oldKeys = {};
addEventListener("keydown", function (e) 
{
	//...why are we doing it this way???
	//what's wrong with a simple flip?
	if(!keys.hasOwnProperty(e.keyCode))
	{
		 // The key is newly down!
    	keys[e.keyCode] = true;
	}
}, false);

addEventListener("keyup", function (e) 
{
	if(keys.hasOwnProperty(e.keyCode))
	{
		 // The key is newly released!
    	delete keys[e.keyCode];
	}

}, false);

addEventListener("mousedown",function(e) {
	/*if(gamePaused) {
		resumeGame();
		return;
	}*/
	if(tongue.canExtend){
		var mouse = new Vector(0, 0);
		mouse.x = e.pageX - e.target.offsetLeft;
		mouse.y = e.pageY - e.target.offsetTop;
		tongue.extending = true;
		tongue.currSegment = new Segment(tongue.movable.pos.x,tongue.movable.pos.y,1);
		tongue.currSegment.end = mouse;
	}
});

addEventListener("mousemove",function(e) {
	var mouse = new Vector(0, 0);
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	//console.log(mouse.x + ',' + mouse.y);
	if(tongue.extending && tongue.canExtend) {
		tongue.currSegment.end = lerpVector(tongue.currSegment.end,mouse,0.8);
		tongue.mouse = mouse;
	}
});

function input()
{
	//Debug level-reset key: K
	if(keys[75])
	{
		resetLevel();
	}

	if ( keys [87] && !oldKeys[87] ) {    //W

		for (var c =0 ; c < cover.length; c++) {
			if(player.collider.intersects(cover[c].collider))
			{
				console.log("Was " + cover[c].tableState);
				console.log(player.collider);
				console.log(cover[c].collider);
				
				if(player.movable.pos.x <= cover[c].xPos)
				{
					cover[c].alterTableState(TABLE_STATE.LEFT);
				}
				else
				{
					cover[c].alterTableState(TABLE_STATE.RIGHT);
				}
				console.log("Now " + cover[c].tableState);
				console.log("- - -");
				break;
			}

		}
	}

	if ( keys [83] ) {    //S
		//console.log('S');
		//Slide
		player.movement = MOVEMENT.CROUCHING;
	}
	else {

		if((keys[68] && keys[65]) || (!keys[68] && !keys[65]) )
		{
			//  Do nothing when pushing both diretions
			player.movement = MOVEMENT.STANDING;
		}
		else if (keys[68] ) {   // D
			//console.log('D');
			player.facing = FACING.RIGHT;
			player.movement = MOVEMENT.WALKING;
		}

		else if ( keys[65] ) {    //Aa
			//console.log('A');
			player.facing = FACING.LEFT;
			player.movement = MOVEMENT.WALKING;
		}

	
		/*if ( keys [32] ) {    //Space
			//console.log('Space');
			// Bullet
			if(player.canShoot){
				var b = new Bullet(0,player.movable.px,player.movable.py-35,30);
				b.facing = player.facing;
				bullets.push(b);
				player.canShoot = false;
			}

		}*/
		if ( keys [16] ) {    //Shift
			//console.log('Shift');
			//  Run
		}
		if ( keys [80] ) {    //p
			if(gamePaused){
				gamePaused = false;
				resumeGame();
				//console.log('Resume');
			}
			else {
				//console.log('Pause');
				gamePaused = true;
				pauseGame();
			}
		}
	}
}