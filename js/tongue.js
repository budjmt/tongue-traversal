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
	this.end = lerpVector(this.end,this.start,clamp(lerpSpeed,0,1));
}

var Tongue = function() {
	this.movable = new Movable(20,canvas.height - 20);
	this.segments = [];
	this.numSegments = 0;//because length is not accurate
	this.maxSegments = 20;
	this.duration = 0.1;//how long you can hover in seconds before locking the segment
	this.currTime = 0;
	this.currSegment = null;
	this.canExtend = true;//you can extend if you aren't retracting
	this.extending = false;//when you are moving the tongue around
	
	this.lerpSum = 0.5;
	
	this.mouse = null;//this is so that the new segments aren't weird
}

Tongue.prototype.update = function(dt) {
	if(!this.canExtend) {
		this.currSegment.retract(this.lerpSum);
		if(this.currSegment.end.sub(this.currSegment.start).mag() < 0.1) {
			this.segments.pop();
			this.currSegment = this.segments[this.segments.length - 1];
			this.numSegments--;
			this.lerpSum += 0.035;
			if(this.numSegments < 1) {
				this.currSegment = null;
				this.canExtend = true;
				this.extending = false;
				this.lerpSum = 0.5;
			}
		}
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
		}
		if(this.numSegments >= this.maxSegments) {
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
		r += 10; g += 3; b += 3;
		ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
		ctx.lineWidth = Math.min(50, 50 / element.length() * 100);
		ctx.beginPath();
		ctx.moveTo(element.start.x,element.start.y);
		ctx.lineTo(element.end.x,element.end.y);
		ctx.stroke();
	});
	if(this.currSegment != null) {
		r += 10; g += 3; b += 3;
		ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
		ctx.beginPath();
		ctx.moveTo(this.currSegment.start.x,this.currSegment.start.y);
		ctx.lineTo(this.currSegment.end.x,this.currSegment.end.y);
		ctx.stroke();
	}
}