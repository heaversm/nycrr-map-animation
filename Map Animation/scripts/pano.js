var PANO = new PanoClass();

function PanoClass() {

  var self = this;

  //Panoloader Documentaion: https://github.com/spite/GSVPano.js
  var panoLoader, panoInstance; //GSV Pano vars

  var $hyperlapse = $('#hyperlapse'); //DOM reference vars

  var hyperCanvas, hyperCtx; //canvas vars

  var camera,scene,renderer,mesh; //threejs vars
  var FOV = 70, windowWidth, windowHeight; //threejs dimensions

  var lat,lon; //google maps vars
  var position = { x: 0, y: 0 };
  var activeLocation = null;
  var startPoint;

  //For use in animating
  TWEEN.start();
  var cd = new Date();
  var time = cd.getTime();

  function init(){
    //console.log('init pano class');
    panoLoader = new GSVPANO.PanoLoader();
  }

  function buildScene(){
      
      hyperCanvas = document.createElement( 'canvas' );
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
      /*mesh.material.map = new THREE.Texture (hyperCanvas);
      mesh.material.map.needsUpdate = true;*/

      scene.add(mesh);
      $hyperlapse.append ( renderer.domElement );

      buildPanoEvents();

      //animate();

  }

  function buildPanoEvents(){

    console.log

    panoLoader.onPanoramaLoad = function() {
      console.log('Panorama loaded');
      panoInstance = this;
      buildPanorama(panoInstance);
    }

    /*panoLoader.onPanoramaLoad = function() {
      activeLocation = this.location;
      mesh.material.map = new THREE.Texture( this.canvas ); 
      mesh.material.map.needsUpdate = true;
      showMessage( 'Panorama tiles loaded.<br/>The images are ' + this.copyright );
      showProgress( false );
    };*/

    panoLoader.onProgress = function( p ) {
      //
    };
      
    panoLoader.onPanoramaData = function( result ) {
      console.log( 'Panorama OK. Loading and composing tiles...' );
    }
    
    panoLoader.onNoPanoramaData = function( status ) {
      showError("Could not retrieve panorama for the following reason: " + status);
    }

    panoLoader.load( startPoint);
    

  }

  function buildPanorama(panoInstance){
    activeLocation = this.location;
    mesh.material.map = new THREE.Texture( panoInstance.canvas ); 
    mesh.material.map.needsUpdate = true;
    
    camera.target.x = 500;
    camera.target.y = 500;
    camera.target.z = 500;
    camera.lookAt( camera.target );
    
    renderer.render( scene, camera );

    MAP.panoReady();
    //animate();

    console.log('Panorama built');

  }

  function animate(){
    requestAnimationFrame( animate );
    render();
  }

  function render() {

    var cd = new Date();
    ctime = cd.getTime();
    
    ellapsedTime = ( ctime - time );
    ellapsedFactor = ellapsedTime / 16;

    var olon = lon, olat = lat;
    var s = .15 * ellapsedFactor;
    lon = lon + ( position.x - olon ) * s;
    lat = lat + ( position.y - olat ) * s;
      
    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = ( 90 - lat ) * Math.PI / 180;
    theta = lon * Math.PI / 180;

    camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
    camera.target.y = 500 * Math.cos( phi );
    camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
    camera.lookAt( camera.target );
    
    renderer.render( scene, camera );
    
    time = ctime;

  }


  //adds the panorama to the stage and signals to the map class that we are ready to proceed with animation
  function addPanorama(){
    hyperlapse.append(hyperCanvas);
    MAP.panoReady();
  }

  self.initHyperlapse = function(startLat,startLon){
    console.log('initHyperlapse: ' + startLat + ',' + startLon);
    lat = startLat;
    lon = startLon;
    startPoint = MAP.getLatLng(startLat,startLon)
    
    buildScene();

    //panoLoader.load( startPoint);

  }

  init();

}
