let boids = [];
let screenDiag;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for(let i = 0; i < 200; i++){
    let newBoid = new Boid(createVector(random(-(width*0.25),width*0.25),random(-(height*0.25),height*0.25)), createVector(random(-2.5,2.5),random(-2.5,2.5)), i);
    boids.push(newBoid);
  }
  
  screenDiag = sqrt(pow(width,2) + pow(height,2));
  
}

function draw() {
  background(20);
  translate(width/2,height/2);
  for(let i = 0; i < boids.length; i++){
    boids[i].move(boids);
    boids[i].show();
  }
  
}

function Boid(pos, vel, id) {
    // Properties
    this.id = id; 
    this.pos = pos;
    this.heading = createVector(0,0);
    this.vel = vel;
    this.visRadius = 100;

    // Method to get the full name
    this.move = function(Boids) {
      this.goalVec = createVector(mouseX - (width/2),mouseY - (height/2));
      this.goal(this.goalVec,0.25);
      this.align(Boids, 0.075);
      this.separate(Boids, 0.75);
      this.cohere(Boids,0.75);
      this.vel.mult(0.9788);
      this.pos.add(vel);
      this.heading = p5.Vector.heading(this.vel);
      this.wrap(true);
    };
  
  this.show = function() {
      push();
        stroke(200);
        fill(100);
        strokeWeight(2);
        translate(this.pos);
        rotate(this.heading - (PI*0.5));
        triangle(0,5,-2,-2,2,-2);
    pop();
  }
  
  this.separate = function(Boids, weight){
    for(let i = 0; i < Boids.length; i++){
      if(i != this.id){
        let dist = p5.Vector.dist(this.pos, Boids[i].pos);
          if(dist < this.visRadius){
            let pushDir = p5.Vector.sub(this.pos,Boids[i].pos);
            pushDir.normalize();
            pushDir.mult(pow(1 - (dist/this.visRadius), 3));
            this.vel.add(p5.Vector.mult(pushDir,weight));
          }
      }
    }  
  }
  
  this.cohere = function(Boids, weight){
    let avgPos = createVector(0,0);
    let boidCount = 0;
    for(let i = 0; i < Boids.length; i++){
      if(i != this.id){
        let dist = p5.Vector.dist(this.pos, Boids[i].pos);
          if(dist < this.visRadius){
            boidCount += 1;
            avgPos.add(Boids[i].pos);
          }
      }
    }
    if(boidCount > 0){
      avgPos.div(createVector(boidCount,boidCount));
      let avgDist = p5.Vector.dist(this.pos,avgPos);
      let pushDir = p5.Vector.sub(avgPos,this.pos);
      pushDir.normalize();
      pushDir.mult(pow(1 - (avgDist/this.visRadius), 0.5));
      this.vel.add(p5.Vector.mult(pushDir,weight));
    }
  }
  
  this.goal = function(goalVector, weight){
    if(mouseIsPressed){
      let dist = p5.Vector.dist(this.pos,goalVector); 
      let pushDir = p5.Vector.sub(goalVector,this.pos);
      pushDir.normalize();
      pushDir.mult(pow(1 - (dist/screenDiag), 0.75));
      this.vel.add(p5.Vector.mult(pushDir,weight));
    }
  }
  
  
  this.align = function(Boids, weight){
    let avgAngle = 0;
    let boidCount = 0;
    for(let i = 0; i < Boids.length; i++){
      if(i != this.id){
        let dist = p5.Vector.dist(this.pos, Boids[i].pos);
          if(dist < this.visRadius){
            boidCount += 1;
            avgAngle += this.vel.angleBetween(Boids[i].vel);
          }
      }
    }
    if(boidCount > 0){
      avgAngle = avgAngle/boidCount;
      push();
        translate(this.pos);
        this.vel.rotate(avgAngle * weight);
      pop();
    }
  }
  
  this.wrap = function(collide){
    //Based on sebastian lague's succinct edge handling: https://youtu.be/rSKMYc1CQHE?si=mkgNL1gM-iPJ2_v5&t=70
    //Relies on canvas centre being 0,0
    var halfBounds = createVector(width/2,height/2);
  
    if(collide){
      if(abs(this.pos.x) > halfBounds.x){
        this.pos.x = halfBounds.x * Math.sign(this.pos.x);
        this.vel.x *= -1;
      }
      if(abs(this.pos.y) > halfBounds.y){
        this.pos.y = halfBounds.y * Math.sign(this.pos.y);
        this.vel.y *= -1;
      }
    } else {
      if(abs(this.pos.x) > halfBounds.x){
        this.pos.x = halfBounds.x * -Math.sign(this.pos.x);
      }
      if(abs(pos.y) > halfBounds.y){
        this.pos.y = halfBounds.y * -Math.sign(this.pos.y);
      }
    }
  }  
}
