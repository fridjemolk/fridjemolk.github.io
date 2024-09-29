/* 
Sphere Tracing Ray Marching implemenation in p5.js by Nate Townsend
Inspired by Sebastian Lague's unity ray marching coding adventure: https://youtu.be/Cp5WWtMoeKg 
*/

var circles;
var diammeters;
var boundary;
var circleNo;
var pos;
var newPoint;
var r;
var angle;
var hits;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB,255,255,255,255);
  angle = PI/4;
  boundary = 80;
  circleNo = 4;
  circles = [];
  diammeters = [];
  hits = [];
  
  //create some circles with random positions and diammeters  
  for(var i = 0; i < circleNo; i++){
    circles.push(createVector(map(random(),0,1,boundary,width-boundary),map(random(),0,1,boundary,height-boundary)));
    diammeters.push(map(random(),0,1,40,boundary-5));
  }

}

function draw() {
  background(0);
  pos =  createVector(50,50);
  fill(255);
  //increase the angle the ray is pointing over time 
  angle = radians((frameCount/10)%90);
  stroke(255);
  //draw the collision circles 
  for(var i = 0; i < circleNo; i++){
    push();
    fill(128,128);
    noStroke();
    ellipse(circles[i].x,circles[i].y,diammeters[i]);
    pop();
  }
  
    //draw the hit points
  for (var h = 0; h < hits.length; h++){
      push();
      var hitDist = dist(hits[h].x,hits[h].y,0,0);
      var maxDist = dist(0,0,width,height);
      var hitHue = map(hitDist,0,maxDist,255,0);
      noStroke();
      fill(hitHue);
      ellipse(hits[h].x,hits[h].y,2);
      pop();
  }
    
  for(var j = 0; j < 14; j++){
  //run the distance calculation function and write the result to a useful variable
    //r = min(nearestCircle(circles,diammeters,pos)*2,nearestWall(pos));
    r = nearestCircle(circles,diammeters,pos)*2;
    //console.log(r);
    push();
    translate(pos.x,pos.y);
  //if the nearest circle is closer than a certain threshold, consider that point along the ray as a hit and  write it to an array, then break the for loop
    if (r < 2){
        push();
        noStroke();
        fill(255);
        hits.push(createVector((r/2)*cos(angle)+pos.x,(r/2)*sin(angle)+pos.y));
    } 
    else if (nearestWall(pos) < 2){
        console.log(nearestWall(pos));
        if(pos.x > width){
          pos.x = width-10;
        }
        if(pos.y > height){
          pos.y = height-10;
        }
        hits.push(createVector((r/2)*cos(angle)+pos.x,(r/2)*sin(angle)+pos.y));
        break;
    }
  // if theres no hit, march one step further along the ray, and draw the corresponding lines and circles to visualise the process
    else {
        push();
        fill(255,100);
        stroke(255);
        ellipse(0,0,r);
        pop();
        //var hitDist = dist(0,0,hits[0].x,hits[0].y);
        //var maxDist = dist(0,0,width,height);
        //var hitHue = map(hitDist,0,maxDist,0,255);
        fill(128);
        ellipse(0,0,10);
        line(0,0,(r/2)*cos(angle),(r/2)*sin(angle));
  //work out where the ray intersects the locus given by nearestCircle(), and write it to a new vector
        newPoint = createVector((r/2)*cos(angle)+pos.x,(r/2)*sin(angle)+pos.y);
        pop();
  //set the position for the next ray marching step to the pos vector
        pos = newPoint;
    }
  }
      
  //if the ray reaches the end, draw the points and the collision circles, and stop looping
  if (angle > radians(89)){
      background(0);
      //for (var h = 0; h < hits.length; h++){
        push();
        /*
        var hitDist = dist(hits[h].x,hits[h].y,0,0);
        var maxDist = dist(0,0,width,height);
        var hitHue = map(hitDist,0,maxDist,0,255);
        noStroke();
        fill(hitHue,255,255,255);
        */
        pop();
      //}
      //for(var i = 0; i < circleNo; i++){
        push();
        fill(128,128);
        noStroke();
        //ellipse(circles[i].x,circles[i].y,diammeters[i]);
        pop();
      //}
      noLoop();
      location.reload();
  }
}

function nearestCircle(fCircles,fdiammeters,fPos){
    // work out the distance to the nearest circle from the current ray march point
    var maxDist = dist(0,0,width,height);
    var dstToHit = maxDist+20;
    for(var i = 0; i < circleNo; i++){
        var dstToCircle = ((dist(fPos.x,fPos.y,fCircles[i].x,fCircles[i].y))  - (fdiammeters[i])/2);
        dstToHit = min(dstToCircle, dstToHit);
    }
    return dstToHit;
}

function nearestWall(fPos){
    // work out the distance to the nearest circle from the current ray march point
    var maxDist = dist(0,0,width,height);
    var dstToHit = maxDist;
    for(var i = 0; i < circleNo; i++){
        if(fPos.x > width || fPos.y > height){
          dstToHit = 0.1;
        }
    }
    return dstToHit;
}
