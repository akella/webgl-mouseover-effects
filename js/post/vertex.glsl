uniform float time;
uniform float progress;
uniform vec2 resolution;
varying vec2 vUv;
uniform sampler2D texture1;

const float pi = 3.1415925;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
}


