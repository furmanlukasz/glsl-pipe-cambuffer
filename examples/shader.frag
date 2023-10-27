#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_doubleBuffer0;
uniform sampler2D   u_video;
uniform vec2        u_resolution;
uniform float       u_time;
uniform float       u_radius;
uniform float       u_kernel_size;

#include "lygia/space/ratio.glsl"
#include "lygia/color/palette/hue.glsl"
#include "lygia/draw/circle.glsl"

#include "lygia/sample/clamp2edge.glsl"

#define BLUENOISE_TEXTURE_RESOLUTION u_noiseResolution
#define NOISEBLUR_SAMPLER_FNC(TEX, UV) sampleClamp2edge(TEX, UV)
#include "lygia/filter/noiseBlur.glsl"

#define EDGE_SAMPLER_FNC(TEX, UV) sampleClamp2edge(TEX, UV).r
#include "lygia/filter/edge.glsl"

#define KUWAHARA_SAMPLER_FNC(TEX, UV) sampleClamp2edge(TEX, UV)
#include "lygia/filter/kuwahara.glsl"

void main() {
    vec3 color = vec3(0.0);
    vec2 pixel = 1.0/u_resolution.xy;
    vec2 st = gl_FragCoord.xy * pixel;
    vec4 video = texture2D(u_video, st);

    vec3 filter_kernel = noiseBlur(u_doubleBuffer0, st, pixel, u_kernel_size).rgb;


#ifdef DOUBLE_BUFFER_0
    color = texture2D(u_doubleBuffer0, st).rgb * 0.998;

    color += edgeSobel(u_video, st, pixel * u_radius);
    
    color -= video.rgb * 0.05;

    // color = mix(color, filter_kernel, 0.5); 

#else
    color += texture2D(u_doubleBuffer0, st).rgb;

#endif
    
    gl_FragColor = vec4(color, 1.0);
}


