TWEEN.start();
        
var map, canvas, ctx;
var marker = null;
var container, mesh, renderer, camera;
var fov = 70;
var lat = 0, lon = 0;
var zoom;
var error;
var message;
var activeLocation = null;
var cd = new Date();
var time = cd.getTime();
var position = { x: 0, y: 0 };
var loader = new GSVPANO.PanoLoader();

function initialize(){
  var myLatlng = new google.maps.LatLng( 40.60189764651378, -74.0608549118042 );

  canvas = document.createElement( 'canvas' );
  ctx = canvas.getContext( '2d' );
  container = document.getElementById( 'pano' );

  camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 1100 );
  camera.target = new THREE.Vector3( 0, 0, 0 );
  
  scene = new THREE.Scene();
  scene.add( camera );

  try {
    var isWebGL = !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
  }catch(e){
    
  }

  renderer = new THREE.WebGLRenderer();
  renderer.autoClearColor = false;
  renderer.setSize( window.innerWidth, window.innerHeight );

  var faces = 50;
  mesh = new THREE.Mesh( new THREE.SphereGeometry( 500, 60, 40 ), new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/placeholder.jpg' ) } ) );
  mesh.doubleSided = true;
  scene.add( mesh );

  container.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResized, false );
  

  loader.onProgress = function( p ) {
    //
  };
  
  loader.onPanoramaData = function( result ) {
    console.log( 'Panorama OK. Loading and composing tiles...' );
  }
  
  loader.onNoPanoramaData = function( status ) {
    console.log("Could not retrieve panorama for the following reason: " + status);
  }
  
  loader.onPanoramaLoad = function() {
    activeLocation = this.location;
    mesh.material.map = new THREE.Texture( this.canvas ); 
    mesh.material.map.needsUpdate = true;
    console.log( 'Panorama tiles loaded.');
  };

  loader.load( myLatlng );
  onWindowResized( null );
  animate();


}

function onWindowResized( event ) {
  
  var aspect = container.clientWidth / container.clientHeight;
  renderer.setSize( container.clientWidth, container.clientHeight );

  //debugger;

  camera.projectionMatrix = THREE.Matrix4.makePerspective( fov, aspect, 1, 1100 );
}

function animate() {

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


window.addEventListener( 'load', initialize, false );