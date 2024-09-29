let body1, body2;

//The gravitational constant is 6.673*10^-11 m^3⋅kg^–1⋅s^–2
const gravConst = 6.673*Math.pow(10,-11);

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB,255,255,255,255);
  
  //Make some objects, the first two close together with similar masses and velocities, the last with no velocity and a much higher mass
  body1 = new gravBody(width/2*10,height/2,180,0,5,500);
  body2 = new gravBody(width/2*10, height/4,210,0,5,200);
  body3 = new gravBody(width/2*10,height/2*10,0,0,5,2000);
  
}

function draw() {
  background(0,25);
  
  //Run the sketch after waiting a little 
  if(frameCount > 20){
    loop();
    //Calculate the new positions of the bodies relative to the other bodies in the universe
    //The order of operations here is counterintuitive, and I have no idea if this is the right one. 
    body1.run(body3);
    body1.run(body2);
    body2.run(body1);
    body2.run(body3);
    push();
      //Draw everything but scaled down so we can see it all 
      scale(0.1);
      body1.draw();
      body2.draw();
      body3.draw();
    pop();
  }
  //body3.pos = createVector(mouseX*10,mouseY*10);
}

function gravBody(posX,posY,accelX,accelY,density,mass){
  //Actual position variable
  this.pos = createVector(posX,posY);
  //Position last frame
  this.posP = createVector(posX,posY);
  
  this.accel = createVector(accelX,accelY);
  //Make the density and mass much, much bigger than those entered above - the newtonian gravity equation deals with huge scales of force and mass, so these need to be huge for anything interesting to happen 
  this.density = density*100000000;
  this.mass = mass*100000000;
  
  //Make a colour and radius dependent on the physical properties of the body
  this.radius = this.mass/this.density;
  this.colour = color(this.radius);
  
  this.draw = function(){
    //push();
      //noStroke();
      //fill(this.colour);
      //circle(this.pos.x,this.pos.y,this.radius);
    //pop();
    
    //Draw a line from the current position to the acceleration vector (the position next frame)
    push();
      strokeWeight(this.radius/2);
      stroke(this.colour);
      line(this.pos.x,this.pos.y,this.accel.x+this.pos.x,this.accel.y+this.pos.y);
    pop();
    //Update the position vectors 
    this.pos.add(this.accel);
    this.posP = this.pos;
  }
  
  this.run = function(otherBody){
    //r = distance between the two bodies 
    var r = dist(this.posP.x,this.posP.y,otherBody.posP.x,otherBody.posP.y);
    //Newtonian gravity equation https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation
    var f = gravConst * this.mass*otherBody.mass/r*r;
    //Convert force to acceleration 
    var a = f/this.mass;
    //Find the direction from this body to the one we are calculating against
    var dir = createVector(otherBody.posP.x-this.posP.x,otherBody.posP.y-this.posP.y);
    //Normalize it
    dir.normalize();
    //And multiply it by the acceleration due to gravity
    dir.mult(a);
    this.accel.add(dir);
  }
}
