import * as THREE from "three";
import EffectComposer, {
    RenderPass,
    ShaderPass,
} from '@johh/three-effectcomposer';

    var camera, scene, renderer, composer,renderPass,customPass;
    var geometry, material, mesh, texture,uMouse = new THREE.Vector2(0,0);
    var img = document.getElementById('texture');

    let dummyimg = document.createElement("img");
    dummyimg.onload = function(){
      document.body.classList.remove('loading')
      img.style.opacity = 0;
      texture = new THREE.Texture( this );
      texture.needsUpdate = true;
      
      init()
      animate();
    }
    dummyimg.src = img.src;

    function init() {
      console.log(texture);
      camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
      camera.position.z = 0.5;

      scene = new THREE.Scene();

      geometry = new THREE.PlaneGeometry( 0.45, 0.3);
      material = new THREE.MeshBasicMaterial({
        map: texture
      });
      mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.outputEncoding = THREE.sRGBEncoding;
      document.body.appendChild( renderer.domElement );

      // post processing
      composer = new EffectComposer(renderer);
      renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      var myEffect = {
        uniforms: {
          "tDiffuse": { value: null },
          "resolution": { value: new THREE.Vector2(1.,window.innerHeight/window.innerWidth) },
          "uMouse": { value: new THREE.Vector2(-10,-10) },
          "uVelo": { value: 0 },
        },
        vertexShader: `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );}`,
        fragmentShader: `uniform float time;
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        varying vec2 vUv;
        uniform vec2 uMouse;
        float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
          uv -= disc_center;
          uv*=resolution;
          float dist = sqrt(dot(uv, uv));
          return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
        }
        void main()  {
            vec2 newUV = vUv;
            float c = circle(vUv, uMouse, 0.0, 0.2);
            float r = texture2D(tDiffuse, newUV.xy += c * (0.1 * .5)).x;
            float g = texture2D(tDiffuse, newUV.xy += c * (0.1 * .525)).y;
            float b = texture2D(tDiffuse, newUV.xy += c * (0.1 * .55)).z;
            vec4 color = vec4(r, g, b, 1.);

            gl_FragColor = color;
        }`
      }

      customPass = new ShaderPass(myEffect);
      customPass.renderToScreen = true;
      composer.addPass(customPass);

    }

    document.addEventListener('mousemove', (e) => {
      // mousemove / touchmove
      uMouse.x = ( e.clientX / window.innerWidth ) ;
      uMouse.y = 1. - ( e.clientY/ window.innerHeight );
    });

    function animate() {
      customPass.uniforms.uMouse.value = uMouse;
      requestAnimationFrame( animate );

      // renderer.render( scene, camera );
      composer.render()

    }