var PANO = new PanoClass();

function PanoClass() {

  var self = this;

  function init(){
    console.log('init pano class');
  }

  self.initHyperlapse = function(startPoint,endPoint,midPoint){

    var hyperlapse = new Hyperlapse(document.getElementById('hyperlapse'), {
      lookat: midPoint,
      zoom: 1,
      use_lookat: true,
      elevation: 50
    });

    hyperlapse.onError = function(e) {
      console.log(e);
    };

    hyperlapse.onRouteComplete = function(e) {
      hyperlapse.load();
    };

    hyperlapse.onLoadComplete = function(e) {
      hyperlapse.play();
      MAP.panoReady();
    };

    // Google Maps API stuff here...
    var directions_service = new google.maps.DirectionsService();

    var route = {
      request:{
        origin: startPoint,
        destination: endPoint,
        travelMode: google.maps.DirectionsTravelMode.WALKING
      }
    };

    directions_service.route(route.request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        hyperlapse.generate( {route:response} );
      } else {
        console.log(status);
      }
    });

  }

  init();

}
