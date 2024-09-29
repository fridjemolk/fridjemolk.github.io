var radius;
var minDimension;
var iterations;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  
  radius = 75;
  
  iterations = 180;
  
  minDimension = min(width,height);
}

function draw() {
  background(0,50);
  translate(width/2,height/2);
  //translate(mouseX,mouseY);
  rotate(frameCount/500);
  noFill();
  for(var i = 0; i < iterations; i++){
    var r = map(noise(frameCount/200),0,1,
                radius*map(noise(i),0,1,2,2.5),
                (minDimension/2)-radius*map(noise(i),0,1,2,2.5));
    var x = r*cos(i*(TWO_PI/iterations));
    var y = r*sin(i*(TWO_PI/iterations));
    var eyeHue = map(noise(i),0,1,150,170);
    var eyeSat = map(noise(i),0,1,130,180);
    stroke(eyeHue,150);
    circle(x, y, radius*map(noise(i),0,1,2,2.5));
  }
}