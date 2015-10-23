var Segment = function(x,y,num) {
	this.start = new Vector(x,y);
	this.end = new Vector(x,y);
	this.num = num;
}

Segment.prototype.length = function() {
	return this.end.sub(this.start).mag();
}

Segment.prototype.retract = function(lerpSpeed) {
	var slope = (this.end.y - this.start.y) / (this.end.x - this.start.x);
	this.end = lerpVector(this.end,this.start,clamp(lerpSpeed,0,0.8));
}

Segment.prototype.reverse = function(lerpSpeed) {
	var slope = (this.end.y - this.start.y) / (this.end.x - this.start.x);
	//console.log(this.start.x + ',' + this.start.y + '/' + this.end.x + ',' + this.end.y);
	this.start = lerpVector(this.start,this.end,clamp(lerpSpeed,0,0.8));
}

var Tongue = function() {
	this.movable = player.movable;
	this.segments = [];
	this.numSegments = 0;//because length is not accurate
	this.maxSegments = 20;
	this.duration = 0.1;//how long you can hover in seconds before locking the segment
	this.currTime = 0;
	this.currSegment = null;
	this.canExtend = true;//you can extend if you aren't retracting
	this.extending = false;//when you are moving the tongue around
	this.retracting = false;//when you retract towards it
	
	this.lerpSum = 0.4;
	this.meterLength = 1000;
	this.meterMax = 1000;
	
	this.mouse = null;//this is so that the new segments aren't weird
}

Tongue.prototype.retractTongue = function() {
	this.currSegment.retract(this.lerpSum);
	if(this.currSegment.length() < 0.1) {
		this.segments.pop();
		this.numSegments--;
		this.currSegment = this.segments[this.numSegments];
		this.lerpSum += 0.035;
		if(this.numSegments < 1) {
			this.currSegment = null;
			this.canExtend = true;
			this.extending = false;
			this.lerpSum = 0.5;
		}
	}
}

Tongue.prototype.reverseTongue = function() {
	this.segments[0].reverse(this.lerpSum);
	player.movable.pos = this.segments[0].start;
	if(this.segments[0].length() < 0.1) {
		this.segments.shift();
		this.numSegments--;
		this.lerpSum += 0.035;
		if(this.numSegments < 1) {
			this.currSegment = null;
			this.canExtend = true;
			this.extending = false;
			this.retracting = false;
			this.lerpSum = 0.5;
		}
	}
}

Tongue.prototype.update = function(dt) {
	if(!this.retracting && this.numSegments > 0) {
		this.segments[0].start = player.movable.pos.add(new Vector(player.width / 2, player.height / 2));
		for(var i = 0;i < grapples.length;i++) {
			if(grapples[i].collider.pointInside(this.currSegment.end.x,this.currSegment.end.y)) {
				this.canExtend = false;
				this.retracting = true;
				break;
			}
		}
	}
	if(!this.canExtend) {
		if(!this.retracting)
			this.retractTongue();
		else
			this.reverseTongue();
	}
	else if(this.extending) {
		//console.log("YES");
		this.currTime += dt
		if(this.currTime >= this.duration) {
			this.segments.push(this.currSegment);
			this.numSegments++;
			this.currSegment = new Segment(this.currSegment.end.x,this.currSegment.end.y
											,this.numSegments + 1);
			this.currSegment.end = this.mouse;
			this.currTime = 0;
			
			this.meterLength -= this.currSegment.length();
		}else{
			this.meterLength -= 1;
		}
		/*
		if(this.numSegments >= this.maxSegments) {
			this.canExtend = false;
			this.currTotalSegments = this.numSegments;
			this.currTime = 0;
		}
		*/
		if (this.meterLength <= 0) {
			//debugger;
			this.meterLength = this.meterMax;
			this.canExtend = false;
			this.currTotalSegments = this.numSegments;
			this.currTime = 0;
		}
		else {
			this.currSegment.end = lerpVector(this.currSegment.end,this.mouse,0.5);
		}
	}
}

Tongue.prototype.draw = function(ctx) {
	ctx.save();
	var r = 150, g = 50, b = 50;
	this.segments.forEach(function(element) {
		if (r < 600) {
			r += 10; g += 3; b += 3;
		}
		var color = 'rgb(' + r + ',' + g + ',' + b + ')';
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = Math.min(20, 20 / element.length() * 200);
		ctx.beginPath();
		ctx.moveTo(element.start.x,element.start.y);
		ctx.lineTo(element.end.x,element.end.y);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(element.end.x,element.end.y,ctx.lineWidth / 2,0,Math.PI * 2,false);
		ctx.fill();
	});
	if(this.currSegment != null) {
		r += 10; g += 3; b += 3;
		var color = 'rgb(' + r + ',' + g + ',' + b + ')';
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(this.currSegment.start.x,this.currSegment.start.y);
		ctx.lineTo(this.currSegment.end.x,this.currSegment.end.y);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.currSegment.end.x,this.currSegment.end.y,ctx.lineWidth / 2,0,Math.PI * 2,false);
		ctx.fill();
	}
	ctx.restore();
}