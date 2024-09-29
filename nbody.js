//The gravitational constant is 6.673*10^-11 m^3⋅kg^–1⋅s^–2
const gravConst = 6.673*Math.pow(10,-11);
const blackHoleMass = 1.989*Math.pow(10,8);  //1.989*10^32 kg (20 solar masses)
const massScalar = Math.pow(10,5);

var edgeHandling = false; //if true, bodies that go off the edge of the screen will be adjusted. Otherwise nothing will happen
var edgeCollision = false; //if true, particles will bounce off canvase edge perfectly ellastically. if false, particles will wrap around the canvas edge and appear on the opposite side of the canvas 

var bodies = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  var initBody = {pos: createVector(0.001,0.001),
                     accel: createVector(0,0),
                     mass: blackHoleMass, 
                     radius: 10,
                     col: color(245,230,35)};
  
  bodies.push(initBody); //Create the sun (all bodies will orbit around the first body in the array, which will not be updated)
  
  var posMult = random(25,25);
  for(var x = -2; x < 3; x++){
    for(var y = -2; y < 3; y++){
      var newMass = random(4,16);
      var newBody = {pos: createVector(x*posMult,y*posMult),
                     accel: createVector(0,0),
                     mass: newMass*massScalar, 
                     radius: map(newMass,4,16,0.5,4),
                     col: map(newMass,4,16,240,80)};
      bodies.push(newBody); //Populate the array with some bodies
    }
  }
}

function draw() {
  background(20,128);
  
  translate(width/2,height/2);
  scale(3);
  
  updateBodies(bodies); //Calculate the gravitational acceleration for all bodies
  
  noStroke();
  
  for(var i = bodies.length-1; i > -1; i--){ 
    bodies[i].pos.add(bodies[i].accel); //Update the positions of the bodies based on their acceleration 
    if(edgeHandling){
      wrapBody(bodies[i],edgeCollision); //Handle the canvas edges
    }
    fill(bodies[i].col); //Set the body colour
    circle(bodies[i].pos.x,bodies[i].pos.y,bodies[i].radius); //Draw the bodies
  }
}

function updateBodies(bodyArray){
  for(var i = 0; i < bodyArray.length; i++){
    for(var j = 0; j < i; j++){
      updateBody(bodyArray[i],bodyArray[j]); //updates the first argument compared to the second argument
    }
  }
}

function updateBody(body1, body2){
  //r = distance between the two bodies 
  var r = dist(body1.pos.x,body1.pos.y,body2.pos.x,body2.pos.y);
  //Newtonian gravity equation https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation
  var force = gravConst * body1.mass*body2.mass/r*r;
  //Convert force to acceleration 
  var accel = force/body1.mass;
  //Find the direction from this body to the one we are calculating against
  var dir = createVector(body2.pos.x-body1.pos.x,body2.pos.y-body1.pos.y);
  //Normalize it
  dir.normalize();
  //And multiply it by the acceleration due to gravity
  dir.mult(accel);
  //And add it to the acceleration of body1
  body1.accel.add(dir);
  //console.log(body1.accel);
}

function wrapBody(body, collide){
  
  //Based on sebastian lague's succinct edge handling: https://youtu.be/rSKMYc1CQHE?si=mkgNL1gM-iPJ2_v5&t=70
  
  var halfBounds = createVector(width/2,height/2);
  
  if(collide){
    if(abs(body.pos.x) > halfBounds.x){
      body.pos.x = halfBounds.x * Math.sign(body.pos.x);
      body.accel.x *= -1;
    }
    if(abs(body.pos.y) > halfBounds.y){
      body.pos.y = halfBounds.y * Math.sign(body.pos.y);
      body.accel.y *= -1;
    }
  } else {
    if(abs(body.pos.x) > halfBounds.x){
      body.pos.x = halfBounds.x * -Math.sign(body.pos.x);
    }
    if(abs(body.pos.y) > halfBounds.y){
      body.pos.y = halfBounds.y * -Math.sign(body.pos.y);
    }
  }
  
}

function mouseDragged() {
  
  var transMouse = createVector(mouseX - width/2, mouseY - height/2);
  transMouse.mult(1/3);
  if(dist(transMouse.x,transMouse.y,bodies[0].pos.x,bodies[0].pos.y) < bodies[0].radius){
    bodies[0].pos.x = transMouse.x;
    bodies[0].pos.y = transMouse.y;
  }
}

/*
function mousePressed() {
  if(dist(mouseX,mouseY,bodies[0].pos.x,bodies[0].pos.y) < bodies[0].radius){
    bodies[0].pos.x = mouseX;
    bodies[0].pos.y = mouseY;
  }
}
*/

function keyPressed() {
  if(key == " "){
    edgeCollision = !edgeCollision;
    if(edgeCollision){
      console.log("Enabling edge collision");
    } else {
      console.log("Disabling edge collision");
    }
  }
  if(keyCode === ENTER){
    edgeHandling = !edgeHandling;
    if(edgeHandling){
      console.log("Enabling edge handling");
    } else {
      console.log("Disabling edge handling");
    }
  }
}