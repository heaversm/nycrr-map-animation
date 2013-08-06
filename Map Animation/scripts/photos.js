var PHOTOS = new PhotoClass();

function PhotoClass() {
  var self = this;

  //SEARCH VARS
  var searchTag = "nycrr"; //the tag to search instagram with
  var maxResults = 10; //total number of photos that will be placed on the map

  //INSTAGRAM VARS
  var client_id = "0d50f3e5c8a84b6eabc4b8ecb8f6aba3";
  var baseURL = "https://api.instagram.com/v1/";
  var recentMediaURL = "/media/recent/";

  var photoArray = [];

  function init(){
    console.log('init photo class');
  }

  self.initPhotos = function(){
    var tagURL = baseURL + "tags/" + searchTag + recentMediaURL + "?client_id=" + client_id;
    
    $.ajax({
      url: tagURL,
      cache: false,
      dataType: "jsonp"
    }).done(function( response ) {
      getPhotoData(response.data);
    });
  }

  function getPhotoData(data){

    var responseLength = data.length;

    var photosWithLocation = [];

    for (var i=0;i<responseLength;i++){ //only retrieve data for photos with location

      if (data[i].location){
        photosWithLocation.push(i);
      }

    }

    var photoLength = photosWithLocation.length;
    var photosToBuild = Math.min(photoLength,maxResults); //the smaller of either the number of results with locations returned from instagram, or the max results allowed

    for (var j=0;j<photosToBuild;j++){
      
      var dataIndex = photosWithLocation[j];

      var responseObj = {};
      responseObj.lat = data[dataIndex].location.latitude;
      responseObj.lng = data[dataIndex].location.longitude;
      responseObj.thumbURL = data[dataIndex].images.thumbnail.url;
      photoArray.push(responseObj);

    }

    placePhotoMarkers();
    
  }

  function placePhotoMarkers(){
    for (var i=0; i<photoArray.length; i++){
      MAP.buildPhotoMarker(photoArray[i].lat,photoArray[i].lng,i,photoArray[i].thumbURL);
    }
  }



  init();

}