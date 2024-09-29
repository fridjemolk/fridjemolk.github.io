/*

Any live cell with two or three live neighbours survives.

Any dead cell with three live neighbours becomes a live cell.

All other live cells die in the next generation. Similarly, all other dead cells stay dead.

*/

let cells, xNo, yNo, cellRadius, choices, births, deaths, cellNo, run;

function setup() {
  //Array to keep all the arrays for each row of cells in
  cells = [];
  //Array that the random() function can choose from to make a random play field
  choices = [true,false];
  
  //Boolean for running the game
  run = true;
  
  //Parameters for the grid size and cell size
  xNo = 60;
  yNo = xNo;
  cellRadius = 3;
  
  //Initialise the statistics
  cellNo = 0;
  births = 0;
  deaths = 0;
  
  createCanvas(((cellRadius*2)*xNo)+20, ((cellRadius*2)*yNo)+60);
  frameRate(999);

  //Stepping through all the cells in the grid, create a new cell and add it to the cells array
  for(iY = 1; iY < yNo+1; iY++){
    //Temporary array for this row 
    var row = [];
    for(iX = 1; iX < xNo+1; iX++){
      
      //Random cells alive or dead
      
      row.push(new cell(iX*(cellRadius*2),
                          iY*(cellRadius*2),
                          iX,
                          iY,
                          random(choices)));
      
      //All dead cells
      /*
      row.push(new cell(iX*(cellRadius*2),
                          iY*(cellRadius*2),
                          iX,
                          iY,
                          false));*/
                          

    }
    //Push the array for this row we just made into the cells array
    cells.push(row);
  }
  
/*
  //Set some cells to be alive. This one is an oscillating bar of three cells: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#/media/File:Game_of_life_blinker.gif
  cells[2][1].state = true;
  cells[2][2].state = true;
  cells[2][3].state = true;
  
  
  
  //This is a 5x5 single-block laying switch engine:  https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#/media/File:Game_of_life_infinite2.svg 
  cells[28][28].state = true;
  cells[28][29].state = true;
  cells[28][30].state = true;
  cells[28][32].state = true;
  
  cells[29][28].state = true;
  
  cells[30][31].state = true;
  cells[30][32].state = true;
  
  cells[31][29].state = true;
  cells[31][30].state = true;
  cells[31][32].state = true;
  
  cells[32][28].state = true;
  cells[32][30].state = true;
  cells[32][32].state = true;
*/
  
  //Count how many cells are alive at the beginning of the game
  for(var x = 0; x < cells.length; x++){
    for(var y = 0; y < cells[x].length; y++){
      if(cells[x][y].state){
        cellNo += 1;
      }
    }
  }
  
}

function draw() {
  background(0);
  
  //Step through all the cells
  for(var y = 0; y < cells.length; y++){
    for(var x = 0; x < cells[y].length; x++){
      
      //Run the game rules against this cell
      if(run){
        cells[x][y].run(x,y);
      }
      //Draw this cell
      cells[x][y].draw(cellRadius);
      
    }
  }
  //Draw all the text 
  noStroke();
  fill(255);
  text("FPS: " + round(frameRate()), 10, height - 37);
  text("Cells: " + cellNo,10,height-27);
  text("Deaths: " + deaths,10,height-17);
  text("Births: " + births, 10, height-7);
  push();
  textAlign(CENTER);
  textSize(32);
  stroke(0);
  if(!run){text("Click Mouse to run",width/2,height/2);}
  pop();
  
  //Step through all the cells and update their state for the next frame
  //In order to compare all the cells to each other in the state for this frame only, this code has two booleans per cell, one for this frame, and one for the next frame. 
  //When we run the run function, it uses the game rules to work out what the state of a certain cell will be next frame, in relation to the state of all it's neighbours this frame.
  //Then, at the end of the frame, once everything else is done, we update every cell's state to be what it should be next frame. 
    for(var j = 0; j < cells.length; j++){
      for(var k = 0; k < cells[j].length; k++){
        if(run){
          cells[k][j].update();
        }
      }
    }
  
}

function cell(_x,_y,_iX,_iY,_state){
  this.pos = createVector(_x,_y);
  this.index = createVector(_iX,_iY);
  this.state = _state;
  this.nextState = this.state; 
  
  this.draw = function(_cellRadius) {
    push();
    //stroke(128);
    noStroke();
    if(this.state){
      fill(255);
    } else{
      fill(0);
    }
    square(this.pos.x,this.pos.y,_cellRadius*2);
    pop();
  }
  
  this.run = function(X,Y) {
     //Only run the game rules against this cell if it isnt on the outside edge of the grid
     if(X != xNo-1 && Y != yNo-1 && X > 0 && Y > 0){
       //Add all the booleans of the 8 neighbouring cells up to make an integer of how many neighbours we have
       var neighbours =  cells[X-1][Y].state + 
                         cells[X+1][Y].state + 
                         cells[X][Y-1].state +
                         cells[X][Y+1].state +
                         cells[X-1][Y-1].state + 
                         cells[X+1][Y+1].state + 
                         cells[X+1][Y-1].state +
                         cells[X-1][Y+1].state;
       //Game rule 1
        if (this.state && (neighbours < 2 || neighbours > 3)){
          this.nextState = false;
          //console.log("a");
          deaths += 1;
          cellNo -= 1;
        } 
        //Grame rule 2
        else if (this.state === false && neighbours == 3){
          this.nextState = true;
          births += 1;
          cellNo += 1;
          //console.log("b");
        } 
        //If no rules apply, carry the cell's current state into the next frame
        else {
          this.nextState = this.state;
        }
       return this.nextState;
      }
    }
  
    this.update = function() {
      //Make this cell's state it's state the game rules said it should ne next frame
      this.state = this.nextState;
    }
    //Function that returns the number of neighbours for this cell
    this.neighbours = function(X,Y){
       var neighbours =  cells[X-1][Y].state + 
                   cells[X+1][Y].state + 
                   cells[X][Y-1].state +
                   cells[X][Y+1].state +
                   cells[X-1][Y-1].state + 
                   cells[X+1][Y+1].state + 
                   cells[X+1][Y-1].state +
                   cells[X-1][Y+1].state;
      return neighbours;
      
    }
  
  }

//Run the code when someone clicks/touches their screen
function mousePressed(){
  run = !run;
  return false;
}
function touchStarted() {
  run = !run;
  return false;
}