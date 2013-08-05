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


  var isUserInteracting = false; //user interaction variables
  var onPointerDownPointerX, onPointerDownPointerY, onPointerDownLon, onPointerDownLat;
  var lookSpeed = .15;

  //For use in animating
  TWEEN.start();
  var cd = new Date();
  var time = cd.getTime();

  function init(){
    //console.log('init pano class');
    panoLoader = new GSVPANO.PanoLoader();
  }

  self.initHyperlapse = function(startLat,startLon){
    console.log('initHyperlapse: ' + startLat + ',' + startLon);
    lat = startLat;
    lon = startLon;
    startPoint = MAP.getLatLng(startLat,startLon)
    
    buildScene();

  }

  function buildScene(){
      
      hyperCanvas = document.createElement( 'canvas' );
      hyperCtx = hyperCanvas.getContext("2d");

      setWindowDimensions();

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

    $hyperlapse[0].addEventListener( 'mousedown', onContainerMouseDown, false );
    $hyperlapse[0].addEventListener( 'mousemove', onContainerMouseMove, false );
    $hyperlapse[0].addEventListener( 'mouseup', onContainerMouseUp, false );
    $hyperlapse[0].addEventListener( 'mousewheel', onContainerMouseWheel, false );
    $hyperlapse[0].addEventListener( 'DOMMouseScroll', onContainerMouseWheel, false);

    window.addEventListener( 'resize', onWindowResized, false );
    onWindowResized( null );

    panoLoader.onPanoramaLoad = function() {
      console.log('Panorama loaded');
      panoInstance = this;
      buildPanorama(panoInstance);
    }

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
    animate();

    console.log('Panorama built');

  }

  function onWindowResized( event ) {

    setWindowDimensions();

    renderer.setSize( windowWidth, windowHeight );
    camera.projectionMatrix = THREE.Matrix4.makePerspective( FOV, aspect, 1, 1100 );

  }

  function onContainerMouseDown( event ) {

    event.preventDefault();

    isUserInteracting = true;
    var el = document.querySelectorAll( '.hide' );
    for( var j = 0; j < el.length; j++ ) {
      el[ j ].style.opacity = 0;
      el[ j ].style.pointerEvents = 'none';
    }
    
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;
    
  }
  
  function onContainerMouseMove( event ) {

    event.preventDefault();
    
    var f = FOV / 500;
    if( navigator.pointer && navigator.pointer.isLocked ) {
      position.x -= event.webkitMovementX * f;
      position.y += event.webkitMovementY * f;
    } else if ( document.mozPointerLockElement == $hyperlapse[0] ){
      if( Math.abs( event.mozMovementX ) < 100 || Math.abs( event.mozMovementY ) < 100 ) { 
        position.x += event.mozMovementX * f;
        position.y -= event.mozMovementY * f;
      }
    } else {
      if ( isUserInteracting ) {
        var dx = ( onPointerDownPointerX - event.clientX ) * f;
        var dy = ( event.clientY - onPointerDownPointerY ) * f;
        position.x = dx + onPointerDownLon; // reversed dragging direction (thanks @mrdoob!)
        position.y = dy + onPointerDownLat;
      }
    }
  }
  
  function onContainerMouseWheel( event ) {
    
    event = event ? event : window.event;
    var nfov = FOV - ( event.detail ? event.detail * -5 : event.wheelDelta / 8 );
    
    var tween = new TWEEN
      .Tween( window )
      .to( { FOV: nfov }, 200 )
      .easing(TWEEN.Easing.Cubic.EaseInOut)
      .onUpdate( function() { 
        camera.projectionMatrix = THREE.Matrix4.makePerspective( FOV, windowWidth / windowHeight, 1, 1100 );
      } )
      .start();

  }

  function onContainerMouseUp( event ) {

    event.preventDefault();
    isUserInteracting = false;
    var el = document.querySelectorAll( '.hide' );
    for( var j = 0; j < el.length; j++ ) {
      el[ j ].style.opacity = 1;
      el[ j ].style.pointerEvents = 'auto';
    }

  }

  function setWindowDimensions(){
    windowWidth = $hyperlapse.width();
    windowHeight = $(window).height();
    aspect = windowWidth / windowHeight;
    console.log(windowWidth,windowHeight,aspect);
  }


  //adds the panorama to the stage and signals to the map class that we are ready to proceed with animation
  function addPanorama(){
    hyperlapse.append(hyperCanvas);
    MAP.panoReady();
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

  init();

}
