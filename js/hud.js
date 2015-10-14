var KEY_COLOR = "yellow";
var HEALTH_RADIUS;

var HUD = function(strokeStyle,gradColor){
    this.width = canvas.width;
    this.height = canvas.height/8;
    this.strokeStyle = strokeStyle;
    this.stroke
    
    var gradient = ctx.createLinearGradient(0,0,0,this.height);
    gradient.addColorStop(0,"rgb(25,25,25)");
    gradient.addColorStop(1,gradColor);
    this.fillStyle = gradient;
    this.opacity = 0.125;
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
    ctx.restore();
}