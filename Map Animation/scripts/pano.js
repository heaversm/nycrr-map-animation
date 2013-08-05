var PANO = new PanoClass();

function PanoClass() {

  var self = this;

  var panoLoader;
  var $hyperlapse = $('#hyperlapse');


  var hyperCanvas, hyperCtx; //canvas vars

  var camera,scene,renderer,mesh; //threejs vars
  var FOV = 70, windowWidth, windowHeight;

  function init(){
    console.log('init pano');
    //Panoloader Documentaion: https://github.com/spite/GSVPano.js
    panoLoader = new GSVPANO.PanoLoader();
    panoLoader.onPanoramaLoad = function() {
      console.log('panorama loaded');
      buildPanorama(this);
    }
  }

  function buildPanorama(thisPano){
      hyperCanvas = thisPano.canvas;
      hyperCtx = hyperCanvas.getContext("2d");

      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;

      camera = new THREE.PerspectiveCamera( FOV, windowWidth / windowHeight, 1, 1100 );
      camera.target = new THREE.Vector3( 0, 0, 0 );

      scene = new THREE.Scene();
      scene.add( camera );

      try {
        var isWebGL = !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
      } catch(e){
        console.log ('no webgl support');
      }

      renderer = new THREE.WebGLRenderer();
      renderer.autoClearColor = false;
      renderer.setSize( windowWidth, windowHeight );

      var faces = 50;
      mesh = new THREE.Mesh( new THREE.SphereGeometry( 500, 60, 40 ), new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/placeholder.jpg' ) } ) );
      mesh.doubleSided = true;
      mesh.material.map = new THREE.Texture (hyperCanvas.canvas);
      mesh.material.map.needsUpdate = true;

      scene.add(mesh);
      $hyperlapse.append ( renderer.domElement );

  }


  //adds the panorama to the stage and signals to the map class that we are ready to proceed with animation
  function addPanorama(){
    hyperlapse.append(hyperCanvas);
    MAP.panoReady();
  }

  self.initHyperlapse = function(startPoint){
    console.log('initHyperlapse');
    panoLoader.load( startPoint);

  }

  init();

}
