#version 300 es
// Bitmap to ASCII (not really) fragment shader by movAX13h, September 2013
// This is the original shader that is now used in PixiJs, FL Studio and various other products.

// Here's a little tool for new characters: thrill-project.com/archiv/coding/bitmap/

// update 2018-12-14: values for characters are integer now (were float)
//                    since bit operations are available now, making use of them
//                    instead of int(mod(n/exp2(p.x + 5.0*p.y), 2.0))
// update 2023-04-21: added characters A-Z and 0-9 and some others
//                    black/white mode does not use gray value anymore
// update 2024-09-16 by fridje: modified shader to work with a P5JS sketch and wrap around 3D objects
//
precision mediump float;

// Uniforms
uniform vec2 u_resolution;
uniform sampler2D u_tex;  // Texture sampler
uniform float char_scale;

// Varying from vertex shader
in vec2 vTexCoord;

out vec4 fragColor;

float bayer_8x8(vec2 pix){
    vec2 pix_offset = floor((pix * vec2(8.0,8.0)) * vec2(0.5,0.5));
    vec2 pix_floor = floor(pix * vec2(8.0,8.0));
    
    return fract((pix_offset.x * 0.5) + ((pix_offset.y  * pix_offset.y) * 0.75)) * 0.25 + 
           fract((pix_floor.x * 0.5) + ((pix_floor.y  * pix_floor.y) * 0.75));
}

float SingleChannelBayerDither(vec2 pix, float val, float steps){
    return floor((val + (bayer_8x8(pix / vec2(8.0,8.0)) / steps)) * steps) / steps;
}

vec3 colorBayerDither(vec2 pix, vec3 col, int colours){

    float perChannelSteps = pow(float(colours),1.0/3.0); 
    //Calculate the per-channel step value based on the desired number of colours (cube root of the total colours)
    
    return vec3(SingleChannelBayerDither(pix, col.x, perChannelSteps),
                SingleChannelBayerDither(pix, col.y, perChannelSteps),
                SingleChannelBayerDither(pix, col.z, perChannelSteps));
}

void main() {
    // Sample the texture using texture coordinates
    vec3 col = texture(u_tex, vTexCoord).rgb;
  
    col = colorBayerDither(vTexCoord * (u_resolution*0.5),col,16);//Final argument is number of colours

    // Output color based on character function
    fragColor = vec4(col, 1.0);
}
