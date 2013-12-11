// bcjs.layout
;(function(_){
  var layout = Object()
  
  layout.redrawListeners = []
  
  layout.appLayout = function() {
    jQuery('body').css({
      'margin': '0',
      'padding': '0',
      'font-family': '"Helvetica Neue",Helvetica,Arial,sans-serif'
    })
    
    // create a div as the container of the app
    var appContainer = jQuery(document.createElement('div'))
    appContainer.css({
      'position': 'absolute',
      'margin': '0',
      'padding': '0',
      'width': '100%',
      'height': '100%',
      'background': 'gray',
      'overflow': 'auto'
    })
    jQuery('body').append(appContainer)
    this.appContainer = appContainer
    
    // store the dimensions
    this.dimensions = {
      appContainerWidth: appContainer.width(),
      appContainerHeight: appContainer.height(),
      screenWidth: screen.width,
      screenHeight: screen.height
    }
  }
  
  layout.getCurrentOrientation = function() {
    return layout.appContainer.height() > layout.appContainer.width() ?
        'portrait' : 'landscape'
  }
  
  layout.onOrientationChange = function(handler) {
    if (!this.orientation) {
      this.orientation = layout.getCurrentOrientation()
    }
    window.addEventListener("deviceorientation", function() {
      var orientation = layout.getCurrentOrientation()
      if (orientation != layout.orientation) {
        layout.orientation = orientation
        handler(orientation)
      }
    })
  }
  
  layout.registerRedrawListener = function(listener) {
    this.redrawListeners.push(listener)
  }
  layout.notifyRedrawListeners = function() {
    for (var i in this.listeners) {
      this.listeners[i]()
    }
  }
  _.layout = layout
})(bcjs)

