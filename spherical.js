let points = [];
//let slider;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB,255,255,255,255);
  
  //slider = createSlider(1,64,16,0.01);
  //slider.position(10, 10);
  //slider.style('500px', '80px');
  
  var pointCount = 2500
  
  for(var i = 0; i < pointCount; i++){
    //var theta = random(-PI,PI);
    //var phi = random(-PI,PI);
    //var r = random(200,205);
    var theta = map(i,0,pointCount-1,0,PI);
    var phi = map(i,0,pointCount-1,-TWO_PI,TWO_PI);
    //var r = random(10,500);
    //var r = map(noise(i*2),0,1,0,500);
    var r = 500;
    var x = r*cos(phi)*sin(theta);
    var y = cos(theta)*r;
    var z = r*sin(phi)*sin(theta);
    
    var h = map(phi,-TWO_PI,TWO_PI,0,255);
    var s = 220;
    var v = 240;
    
    newPoint = {pos:createVector(x,y,z), h:h,s:s,v:v,r:r};
    
    points.push(newPoint);
  }
  
  stroke(255);
  strokeWeight(10);

}

function draw() {
  background(20);
  orbitControl();
  
  //var multiplier = slider.value();
  var multiplier = 0;
  if(frameCount > 90){
    multiplier = map(cos((frameCount-90)*0.001),-1,1,64,0);
  }
  
  gnomon(createVector(0,0,0));
  
  for(var i = 0; i < points.length; i++){
    //var theta = random(-PI,PI);
    //var phi = random(-PI,PI);
    //var r = random(200,205);
    var theta = map(i,0,points.length-1,0,PI);
    var phi = map(i,0,points.length-1,-TWO_PI*multiplier,
                  TWO_PI*multiplier);
    var r = points[i].r;
    var x = r*cos(phi)*sin(theta);
    var y = cos(theta)*r;
    var z = r*sin(phi)*sin(theta);
    
    stroke(points[i].h,points[i].s,points[i].v);
    points[i].pos = createVector(x,y,z);
    
    point(points[i].pos);
  }
  
}

function gnomon(pos){
  
  push();
  
  colorMode(RGB,255,255,255,255);
  
  translate(pos.x,pos.y,pos.z);
  
  strokeWeight(2.5);
  
  stroke(255,0,0);
  
  line(0,0,0,25,0,0);
  
  stroke(0,255,0);
  
  line(0,0,0,0,-25,0);
  
  stroke(0,0,255);
  
  line(0,0,0,0,0,25);
  
  pop();
  
}