uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;


void main()	{
	vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	// newUV.x += 0.02*sin(newUV.y*20. + time);
	gl_FragColor = texture2D(texture1,newUV);
}