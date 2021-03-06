var KEY_COLOR = "yellow";
var HEALTH_RADIUS;

var HUD = function(strokeStyle,gradColor){
    this.width = canvas.width;
    this.height = canvas.height/8;
    this.strokeStyle = strokeStyle;
    
    this.TongueMeter = Object.seal({
        width: undefined,
        height: undefined,
        position: undefined,
        positionInitial: undefined,
        fillStyle: "black",
        barFillStyle: "red",
        barMaxWidth: undefined,
        barWidth: undefined,
        bar2Width: undefined,
        shakeAmount: 2,
        r: 400,
        g: 200,
        b: 200,
        rMax: 400,
        gMax: 200,
        bMax: 200,
    });
    
    this.TongueMeter.width = this.width/3,
    this.TongueMeter.height = this.height - this.height/4,
    this.TongueMeter.barWidth = this.TongueMeter.width;
    this.TongueMeter.bar2Width = this.TongueMeter.width;
    this.TongueMeter.barMaxWidth = this.TongueMeter.width;
    this.TongueMeter.position = new Vector(10, this.height/2 - this.TongueMeter.height/2);
    this.TongueMeter.positionInitial = new Vector(this.TongueMeter.position.x,this.TongueMeter.position.y);
    
    var gradient = ctx.createLinearGradient(0,0,0,this.height);
    gradient.addColorStop(0,"rgb(25,25,25)");
    gradient.addColorStop(1,gradColor);
    this.fillStyle = gradient;
    this.opacity = 0.75;
    this.healthLineWidth = 1;
    HEALTH_RADIUS = this.height/2 - this.height/4;
    this.maxHealth = 4;
    this.testHealth = 4;
    
    this.startHealthColor = {r:255,g:0,b:0};
    this.endHealthColor = {r:117,g:54,b:54};
    
}

HUD.prototype.takeDamage = function(damage){
    this.testHealth -= damage;
}

HUD.prototype.update = function(){
    //debug code for testing the health ui
    if (keys[KeyCode.G] && !oldKeys[KeyCode.G]) {
        this.takeDamage(0.5)
    }
}

function clamp(value,min,max){
    if (value < min) {
        value  = min;
    }else if (value > max) {
        value = max;
    }
    return value;
}

HUD.prototype.drawHealth = function(){
    for(var i=0;i < this.maxHealth;i++){
        this.drawCircle("rgba(30,30,30,0.5)",i,true);
        this.drawCircle("red",i,false);
    }  
}

HUD.prototype.drawCircle = function(color,i,isBack){
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.fillStyle = color;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(this.width - (HEALTH_RADIUS * 2 * 1.2)*(i+1),this.height/2,HEALTH_RADIUS*
            (isBack?  1: clamp(this.testHealth - i,0,1)),
            0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

HUD.prototype.updateTongueMeter = function(tongue){
    if (!tongue.canExtend) {
        if (tongue.numSegments == 1) {
            this.TongueMeter.barWidth = this.TongueMeter.barMaxWidth;
            this.TongueMeter.r = this.TongueMeter.rMax;
            this.TongueMeter.g = this.TongueMeter.bMax;
            this.TongueMeter.b = this.TongueMeter.gMax;

        }else{
            this.TongueMeter.barWidth = lerp(this.TongueMeter.barWidth,this.TongueMeter.barMaxWidth * (mapValue(tongue.meterLength,0,tongue.meterMax)),0.5);
            this.TongueMeter.bar2Width = lerp(this.TongueMeter.bar2Width,this.TongueMeter.barMaxWidth * (mapValue(tongue.meterLength,0,tongue.meterMax)),0.06);
            this.TongueMeter.r = lerp(this.TongueMeter.r,this.TongueMeter.rMax ,0.5);
            this.TongueMeter.g = lerp(this.TongueMeter.g,this.TongueMeter.gMax ,0.5);
            this.TongueMeter.b = lerp(this.TongueMeter.b,this.TongueMeter.bMax ,0.5);
            this.TongueMeter.position = this.TongueMeter.positionInitial.copy();
        }
    }else if (tongue.extending) {
        var mappedValue = mapValue(tongue.meterLength,0,tongue.meterMax);
        //debugger;
        
        this.TongueMeter.barWidth = lerp(this.TongueMeter.barWidth,this.TongueMeter.barMaxWidth * mappedValue,0.5);
        this.TongueMeter.bar2Width = lerp(this.TongueMeter.bar2Width,this.TongueMeter.barMaxWidth * mappedValue,0.06);
        this.TongueMeter.r = this.TongueMeter.r++
        this.TongueMeter.g = lerp(this.TongueMeter.g,this.TongueMeter.gMax *mappedValue,0.5);
        this.TongueMeter.b = lerp(this.TongueMeter.b,this.TongueMeter.bMax *mappedValue,0.5);
        
        var randX = (Math.random() > 0.5)?-Math.random()*this.TongueMeter.shakeAmount*(1-mappedValue):Math.random()*this.TongueMeter.shakeAmount*(1-mappedValue);
        var randY = (Math.random() > 0.5)?-Math.random()*this.TongueMeter.shakeAmount*(1-mappedValue):Math.random()*this.TongueMeter.shakeAmount*(1-mappedValue);
        
        this.TongueMeter.position.x = this.TongueMeter.positionInitial.x - randX;
        this.TongueMeter.position.y = this.TongueMeter.positionInitial.y - randY;
    }
    this.TongueMeter.r  = Math.floor(this.TongueMeter.r);
    this.TongueMeter.g  = Math.floor(this.TongueMeter.g);
    this.TongueMeter.b  = Math.floor(this.TongueMeter.b);
}

var mapValue = function(input,outLow,outHigh){
	return (input-outLow)/(outHigh-outLow);
}

HUD.prototype.drawTongueMeter = function(){
    ctx.save();
        ctx.strokeStyle = "black";
        ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = this.TongueMeter.fillStyle;
            ctx.fillRect(this.TongueMeter.position.x,this.TongueMeter.position.y,this.TongueMeter.width,this.TongueMeter.height);
        ctx.restore();
        
        //var color = 'rgb(' + this.TongueMeter.r + ',' + this.TongueMeter.g + ',' + this.TongueMeter.b + ')';
        ctx.fillStyle = "rgb(200,100,100)";
        ctx.fillRect(this.TongueMeter.position.x,this.TongueMeter.position.y,this.TongueMeter.bar2Width,this.TongueMeter.height);
        
        var color = 'rgb(' + this.TongueMeter.r + ',' + this.TongueMeter.g + ',' + this.TongueMeter.b + ')';
        ctx.fillStyle = color;
        ctx.fillRect(this.TongueMeter.position.x,this.TongueMeter.position.y,this.TongueMeter.barWidth,this.TongueMeter.height);
    ctx.restore();
}

HUD.prototype.draw = function(){
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(10,10,10,0.25)";
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(0,0,this.width,this.height);
    ctx.restore();
    
    ctx.save();
    ctx.shadowBlur = 6;
    ctx.shadowColor = "rgba(10,10,10,0.25)";
    this.drawHealth();
    this.drawTongueMeter();
    ctx.restore();
}