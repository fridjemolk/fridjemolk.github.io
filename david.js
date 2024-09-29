let David;
let norm_tex;
let normalShader;
let asciiShader;
let davidBuffer;

function preload() {
  normalShader = loadShader('normalMap.vert', 'normalMap.frag');
  David = loadModel('david_lowpoly.obj', true, handleModel, handleError, '.obj');
  norm_tex = loadImage('David_Norm.jpg');
  asciiShader = loadShader('ascii.vert', 'ascii.frag');
  // If you have a separate shadow map, load it here
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  davidBuffer = createFramebuffer();
}

function draw() {
  background(20);
  
  davidBuffer.begin();
    clear(); 
    // Enable orbiting with the mouse
    //orbitControl();
    push();
      // Use the custom shader
      shader(normalShader);

      lightPos = createVector(0.0,sin(frameCount * 0.01) * 25, 25.0);
      //lightPos = rotateVectorY(lightPos,frameCount * 0.01);

      // Set Uniforms
      normalShader.setUniform('u_tex', norm_tex);
      normalShader.setUniform('lightPos', [lightPos.x, lightPos.y, lightPos.z]);
      normalShader.setUniform('lightCol', [1.0, 0.35, 0.0]);
      //normalShader.setUniform('lightStrength',1.0);

      push();
      translate((width/2) - (width * 0.25),(height * 0.25),0);
      scale((height * 0.0111111111111) / 1.777777778);
      rotateX(PI);
      rotateY(PI + (sin(frameCount * 0.01) * (PI * 0.25)));
      //rotateY(PI);
      // Draw the shape with normal mapping
      model(David);
      pop();
    pop();
  davidBuffer.end();
  
  // Activate the shader
  shader(asciiShader);

  // Set uniforms for resolution and texture
  asciiShader.setUniform('u_resolution', [width, height]);
  asciiShader.setUniform('u_tex', davidBuffer);
  asciiShader.setUniform('char_scale', map(height,0,1440,0.5,1.0));
  plane(davidBuffer.width,davidBuffer.height);  // A plane the same size as the canvas
  
}

function handleModel(data) {
  David = data;
  console.log("Model loaded:", David);
}

function handleError(error) {
  console.error('Error:', error);
}

function rotateVectorY(vector, angle) {
  // Angle should be in radians
  let cosA = cos(angle);
  let sinA = sin(angle);

  // Rotation matrix for rotation around the Y axis
  let rotationMatrix = [
    [cosA, 0, sinA],
    [0, 1, 0],
    [-sinA, 0, cosA]
  ];

  // Rotate the vector
  let x = vector.x * rotationMatrix[0][0] + vector.y * rotationMatrix[0][1] + vector.z * rotationMatrix[0][2];
  let y = vector.x * rotationMatrix[1][0] + vector.y * rotationMatrix[1][1] + vector.z * rotationMatrix[1][2];
  let z = vector.x * rotationMatrix[2][0] + vector.y * rotationMatrix[2][1] + vector.z * rotationMatrix[2][2];

  return createVector(x, y, z);
}

// Resize the canvas when the
// browser's size changes.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}