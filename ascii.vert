#version 300 es
precision mediump float;

// Vertex attributes
in vec3 aPosition;  // 3D position of the vertex
in vec2 aTexCoord;  // 2D texture coordinates for the vertex

// Uniforms
uniform mat4 uModelViewMatrix;  // Model-view matrix
uniform mat4 uProjectionMatrix; // Projection matrix

// Varying to pass texture coordinates to the fragment shader
out vec2 vTexCoord;

void main() {
    // Pass texture coordinates to the fragment shader
    vTexCoord = aTexCoord;

    // Calculate the position of the vertex in clip space (using 3D transformations)
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}