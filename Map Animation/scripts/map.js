//API: https://code.google.com/apis/console/?pli=1#project:117741775358:access

var MAP = new MapClass();

function MapClass() {
  var self = this;

  var imgPath = 'images/'

  self.map; //will hold the google map

  var racePath; //will hold the polyline route for the race

  //LAT/LNG FINDER: http://itouchmap.com/latlong.html
  var raceMarkers = {
    "centerPoint" : {
      "lat" : 40.703638,
      "lng" : -73.842888,
    },
    "startPoint" : {
      "lat" : 40.60189764651378,
      "lng" : -74.0608549118042,
      "title" : "START",
      "marker" : "marker-teal.png"
    },
    "endPoint" : {
      "lat" : 40.771504,
      "lng" : -73.977385,
      "title" : "FINISH",
      "marker" : "marker-teal.png"
    },
    "runnerPoint" : {
      "lat" : 40.601821,
      "lng" : -74.059181,
      "title" : "RUNNER",
      "marker" : "marker-gray.png"
    }
  }

  var startMarker, endMarker, runnerMarker; //starting, ending, and runner markers
  var raceMarkerArray = []; //will hold the start,end,and runner markers

  var runnerAnimationConfig = { //will hold all of the properties for handling runner animation
    "step" : 5, //meters between marker position
    "tick" : 10, //milliseconds in between animation movements
    "dist" : null, //distance of the route in meters
    "k" : 0,
    "stepnum" : 0,
    "speed" : null,
    "lastVertex" : 1
  }
  var timerHandle;



  //MAP WIZARD: http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
  var mapStyles1 = [
  {
    "featureType": "landscape.man_made",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "administrative.land_parcel",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "administrative.locality",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "poi.attraction",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },{
    "featureType": "poi.business",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "poi.government",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },{
    "featureType": "poi.medical",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },{
    "featureType": "poi.place_of_worship",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "poi.school",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      { "lightness": 45 }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "road.arterial",
    "stylers": [
      { "lightness": 35 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "road.highway",
    "stylers": [
      { "lightness": 40 }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      { "hue": "#00ccff" }
    ]
  }
  ];

  var raceCoords = [
    new google.maps.LatLng(40.60189764651378,-74.0608549118042),
    new google.maps.LatLng(40.602093147015005,-74.05832290649414),
    new google.maps.LatLng(40.610368810433066,-74.03270244598389),
    new google.maps.LatLng(40.61563016586332,-74.02871131896973),
    new google.maps.LatLng(40.616721478730476,-74.03090000152588),
    new google.maps.LatLng(40.6217217440398,-74.02877569198608),
    new google.maps.LatLng(40.63676914395103,-74.02266025543213),
    new google.maps.LatLng(40.638478861213244,-74.02085781097412),
    new google.maps.LatLng(40.66522616228581,-73.99307012557983),
    new google.maps.LatLng(40.67587000470823,-73.98412227630615),
    new google.maps.LatLng(40.68491756205425,-73.97807121276855),
    new google.maps.LatLng(40.686674858813745,-73.97938013076782),
    new google.maps.LatLng(40.68944088021137,-73.95517587661743),
    new google.maps.LatLng(40.70076409998723,-73.95740747451782),
    new google.maps.LatLng(40.70699430376331,-73.96442413330078),
    new google.maps.LatLng(40.70782386917468,-73.96438121795654),
    new google.maps.LatLng(40.71049142123751,-73.96384477615356),
    new google.maps.LatLng(40.7144925489695,-73.9613127708435),
    new google.maps.LatLng(40.72410403167141,-73.9509916305542),
    new google.maps.LatLng(40.730120666389844,-73.95429611206055),
    new google.maps.LatLng(40.73042961402939,-73.95148515701294),
    new google.maps.LatLng(40.7380715463888,-73.95309448242188),
    new google.maps.LatLng(40.743647977027166,-73.95127058029175),
    new google.maps.LatLng(40.74410317521528,-73.95369529724121),
    new google.maps.LatLng(40.74841114665152,-73.95223617553711),
    new google.maps.LatLng(40.74904512643806,-73.95225763320923),
    new google.maps.LatLng(40.74767962400256,-73.94511222839355),
    new google.maps.LatLng(40.74847617049754,-73.94474744796753),
    new google.maps.LatLng(40.75143468822972,-73.9420223236084),
    new google.maps.LatLng(40.753434051497095,-73.94659280776978),
    new google.maps.LatLng(40.759951883332825,-73.9616346359253),
    new google.maps.LatLng(40.80231033412636,-73.93079996109009),
    new google.maps.LatLng(40.80291131449945,-73.93009185791016),
    new google.maps.LatLng(40.80482791825698,-73.92618656158447),
    new google.maps.LatLng(40.80719923274017,-73.92423391342163),
    new google.maps.LatLng(40.80906698928693,-73.92288208007812),
    new google.maps.LatLng(40.81091845258532,-73.92719507217407),
    new google.maps.LatLng(40.81298098682974,-73.92577886581421),
    new google.maps.LatLng(40.81338698995496,-73.92668008804321),
    new google.maps.LatLng(40.812217694228366,-73.92747402191162),
    new google.maps.LatLng(40.81166551963864,-73.92818212509155),
    new google.maps.LatLng(40.8131758686399,-73.9301347732544),
    new google.maps.LatLng(40.81408530951855,-73.93210887908936),
    new google.maps.LatLng(40.814117789319376,-73.93459796905518),
    new google.maps.LatLng(40.81473490251376,-73.93618583679199),
    new google.maps.LatLng(40.80572123160574,-73.94279479980469),
    new google.maps.LatLng(40.80635466469406,-73.9443826675415),
    new google.maps.LatLng(40.8038696232967,-73.94609928131104),
    new google.maps.LatLng(40.803187438792285,-73.94461870193481),
    new google.maps.LatLng(40.78406717869006,-73.95856618881226),
    new google.maps.LatLng(40.7842134037791,-73.95890951156616),
    new google.maps.LatLng(40.78221496636295,-73.96036863327026),
    new google.maps.LatLng(40.781581302919285,-73.96099090576172),
    new google.maps.LatLng(40.78151631145502,-73.96180629730225),
    new google.maps.LatLng(40.781597550775395,-73.96268606185913),
    new google.maps.LatLng(40.78120760113145,-73.96386623382568),
    new google.maps.LatLng(40.77971277295492,-73.9648962020874),
    new google.maps.LatLng(40.77894909775155,-73.96571159362793),
    new google.maps.LatLng(40.77818541376854,-73.9664626121521),
    new google.maps.LatLng(40.77625179166219,-73.96732091903687),
    new google.maps.LatLng(40.77553682469825,-73.96740674972534),
    new google.maps.LatLng(40.77516308890481,-73.96790027618408),
    new google.maps.LatLng(40.77461060605461,-73.96871566772461),
    new google.maps.LatLng(40.77409061799862,-73.96912336349487),
    new google.maps.LatLng(40.77340812749897,-73.96918773651123),
    new google.maps.LatLng(40.77300187982538,-73.96873712539673),
    new google.maps.LatLng(40.77225437761587,-73.96899461746216),
    new google.maps.LatLng(40.771555617945516,-73.96953105926514),
    new google.maps.LatLng(40.77103560597976,-73.97064685821533),
    new google.maps.LatLng(40.77032058288181,-73.97114038467407),
    new google.maps.LatLng(40.76967055520681,-73.97189140319824),
    new google.maps.LatLng(40.769491796481404,-73.97244930267334),
    new google.maps.LatLng(40.768597995641024,-73.97302865982056),
    new google.maps.LatLng(40.76737915693862,-73.97309303283691),
    new google.maps.LatLng(40.76630656038832,-73.97257804870605),
    new google.maps.LatLng(40.76544522032278,-73.97289991378784),
    new google.maps.LatLng(40.76456761707639,-73.97367238998413),
    new google.maps.LatLng(40.767752936517304,-73.98135423660278),
    new google.maps.LatLng(40.76819171855746,-73.98154735565186),
    new google.maps.LatLng(40.76885801167093,-73.97987365722656),
    new google.maps.LatLng(40.77007682324887,-73.97931575775146),
    new google.maps.LatLng(40.77084060044341,-73.97832870483398),
    new google.maps.LatLng(40.77152311731687,-73.97736310958862)
  ];



  var styledMap1 = new google.maps.StyledMapType(mapStyles1,{name: "Styled Map 1"});

  self.init = function(){
    console.log('init');
    buildMap();
  }

  function buildMap(){ //creates a basic map
    console.log('build map');
    var mapOptions = {
      center: new google.maps.LatLng(raceMarkers.centerPoint.lat, raceMarkers.centerPoint.lng),
      zoom: 11,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      }
    };
    self.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    buildMapStyle(styledMap1); //build the underlying map
    buildRoute(raceCoords); //build the polyline path for the race
    buildEndpoints(); //build the start, end, and runner markers
    PANO.initHyperlapse(self.getLatLng(raceMarkers.startPoint.lat,raceMarkers.startPoint.lng)); //initialize hyperlapse from race starting point
  }

  function buildMapStyle(mapStyle){ //styles the standard google map
    console.log('build map style');
    self.map.mapTypes.set('map_style', mapStyle);
    self.map.setMapTypeId('map_style');
  }

  //Polyline Documentation: https://developers.google.com/maps/documentation/javascript/overlays?csw=1#PolylineArrays
  function buildRoute(coords){ //builds the path our runner will take
    console.log('build route');
    racePath = new google.maps.Polyline({
      path: coords,
      strokeColor: "#fd05d1",
      strokeOpacity: 1.0,
      strokeWeight: 3
    });

    racePath.setMap(self.map);
  }

  function buildEndpoints(){ //builds the start, finish, and runner markers
    console.log('buildEndpoints')
    var startObj = raceMarkers.startPoint;
    var endObj = raceMarkers.endPoint;
    var runnerObj = raceMarkers.runnerPoint;
    runnerMarker = buildMarker(runnerObj.lat,runnerObj.lng,runnerObj.title,runnerObj.marker);
    startMarker = buildMarker(startObj.lat,startObj.lng,startObj.title,startObj.marker);
    endMarker = buildMarker(endObj.lat,endObj.lng,endObj.title,endObj.marker);
    raceMarkerArray.push(runnerMarker);
    raceMarkerArray.push(startMarker);
    raceMarkerArray.push(endMarker);
  }

  //Marker Documentation: https://developers.google.com/maps/documentation/javascript/overlays?csw=1#Markers
  function buildMarker(lat,lng,markerTitle,img){
    return new google.maps.Marker({
      position: new google.maps.LatLng(lat,lng),
      map: self.map,
      animation: google.maps.Animation.DROP,
      title: markerTitle,
      icon: imgPath + img
    });
  }

  self.animateRun = function(curDist){ //moves the runner
    if (curDist > runnerAnimationConfig.dist) { //if we've passed the end point, exit this loop and focus on the endpoint

      var endLatLng = self.getLatLng(raceMarkers.endPoint.lat,raceMarkers.endPoint.lng);

      self.map.panTo(endLatLng);
      runnerMarker.setPosition();
      return;
    }

    var curPoint = racePath.GetPointAtDistance(curDist);
    self.map.panTo(curPoint);
    runnerMarker.setPosition(curPoint);
    //updatePoly(curPoint);
    var newDist = curDist + runnerAnimationConfig.step;
    //requestAnimationFrame(self.animateRun(newDist));
    timerHandle = setTimeout("MAP.animateRun("+(curDist+runnerAnimationConfig.step)+")", runnerAnimationConfig.tick);

  }

  self.panoReady = function(){ //called fro pano.js when the panorama class has been initiated
    console.log('panoReady');
    startRunnerAnimation();
  }

  //Example Animation: http://www.geocodezip.com/v3_animate_marker_directions.html
  function startRunnerAnimation(){
    runnerAnimationConfig.dist = racePath.Distance();
    self.map.setCenter(racePath.getPath().getAt(0));
    setTimeout("MAP.animateRun(" + runnerAnimationConfig.step + ")",2000); //give a few seconds for the map to display //MH - find a better way to do this
  }

  self.getLatLng = function(lat,lng){ //returns google map lat lng object
    return new google.maps.LatLng(lat,lng);
  }

}
