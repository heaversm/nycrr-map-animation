var MAIN = new MainClass();

function MainClass(){
  var self = this;

  function init(){
    MAP.init(); //build map, route, and markers
    TWEEN.start(); //enable tweenability
  }

  init();

}
