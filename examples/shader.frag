uniform sampler2D   u_doubleBuffer0;
uniform sampler2D   u_video;
uniform vec2        u_resolution;
uniform float       u_time;
uniform float       u_radius;

#include "lygia/space/ratio.glsl"
#include "lygia/color/palette/hue.glsl"
#include "lygia/draw/circle.glsl"

#include "lygia/sample/clamp2edge.glsl"
#define EDGE_SAMPLER_FNC(TEX, UV) sampleClamp2edge(TEX, UV).r
#include "lygia/filter/edge.glsl"


void main() {
    vec3 color = vec3(0.0);
    vec2 pixel = 1.0/u_resolution.xy;
    vec2 st = gl_FragCoord.xy * pixel;

    float ix = floor(st.x * 5.0);
    float iy = floor(st.y * 5.0);
    vec4 video = texture2D(u_video, st);

#ifdef DOUBLE_BUFFER_0
    color = texture2D(u_doubleBuffer0, st).rgb * 0.998;

    vec2 sst = ratio(st, u_resolution);
    sst.xy += vec2(cos(u_time * 2.0), sin(u_time * 1.7)) * 0.35;

    video = texture2D(u_video, sst);

    color += edgeSobel(u_video, st, pixel * u_radius);


    color -= video.rgb * 0.05;
#else
    color += texture2D(u_doubleBuffer0, st).rgb;

#endif

    gl_FragColor = vec4(color, 1.0);
}


