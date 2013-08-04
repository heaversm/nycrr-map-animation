var PANO = new PanoClass();

function PanoClass() {

  var self = this;

  var panoLoader;
  var $hyperlapse = $('#hyperlapse');

  function init(){
    console.log('init pano');
    panoLoader = new GSVPANO.PanoLoader();
    panoLoader.onPanoramaLoad = function() {
      console.log('panorama loaded');
      $hyperlapse.append(this.canvas);
      MAP.panoReady();
    }
  }



  self.initHyperlapse = function(startPoint){
    console.log('initHyperlapse');
    panoLoader.load( startPoint);

  }

  init();

}
