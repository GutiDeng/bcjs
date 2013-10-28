// bcjs.layout
;(function(_){
  var layout = Object()
  
  layout.mobileLayout = function() {
    // eliminate differences of document.body in browsers
    Zepto('body').css({
      'margin': '0',
      'padding': '0',
      'font-family': '"Helvetica Neue",Helvetica,Arial,sans-serif'
    })
    
    // create a div as the container of the app
    var appZ = Zepto(document.createElement('div'))
    appZ.css({
      'position': 'absolute',
      'margin': '0',
      'padding': '0',
      'width': '100%',
      'height': '100%',
      'background': 'gray',
      'overflow': 'auto'
    })
    Zepto('body').append(appZ)
    this.appZ = appZ
    
    // store the dimensions
    this.dimensions = {
      appZWidth: appZ.width(),
      appZHeight: appZ.height(),
      screenWidth: screen.width,
      screenHeight: screen.height,
    }
  }
  
  _.layout = layout
})(bcjs)

