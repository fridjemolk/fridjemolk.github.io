#version 300 es
precision mediump float;

// Uniforms
uniform vec2 u_resolution;
uniform sampler2D u_tex;  // Texture sampler
uniform vec3 lightPos;
uniform vec3 lightCol;
//uniform float lightStrength;

// Varying from vertex shader
in vec2 vTexCoord;
in vec3 vNormal; //surface normal of model from P5

out vec4 fragColor;

vec3 lambert(vec3 N, vec3 L, vec3 C){
  float dotProd = clamp(dot(normalize(L),N),0.0,1.0);
  return C * dotProd;
}

void main() {
    // Sample the texture using texture coordinates
    vec3 norm_col = (texture(u_tex, vTexCoord).rgb * 2.0) - 1.0; //convert normal map to normal offset values
    vec3 offset_normals = vNormal * norm_col; //offset model normal with normal map from texture
    vec3 shade = lambert(offset_normals,lightPos,lightCol); //lambert shade the model

    fragColor = vec4(shade, 1.0);
}
