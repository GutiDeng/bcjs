// bcjs.ui
;(function(_){
  var ui = Object()
  
  var onClick = function(element, handler) {
    var z = jQuery(element)
    z[0].bcjsOnClickHandler = handler
    
    z[0].addEventListener('touchstart', function(e) {
      this.bcjsOnClickStartX = e.changedTouches[0].clientX
      this.bcjsOnClickStartY = e.changedTouches[0].clientY
      this.bcjsOnClickStartT = (new Date()).getTime()
    })
    z[0].addEventListener('touchend', function(e) {
      e.preventDefault()
      var x = e.changedTouches[0].clientX
      var y = e.changedTouches[0].clientY
      var t = (new Date()).getTime()
      
      if (Math.abs(x - this.bcjsOnClickStartX) > 5) {
        return
      }
      if (Math.abs(y - this.bcjsOnClickStartY) > 5) {
        return
      }
      if (Math.abs(t - this.bcjsOnClickStartT) > 300) {
        return
      }
      
      this.bcjsOnClickHandler(e)
    })
    
    z.on('mousedown', function(e) {
    })
    z.on('mouseup', function(e) {
      this.bcjsOnClickHandler(e)
    })
    
    z.on('mouseenter', function(e) {
      jQuery(this).css({'cursor': 'pointer'})
      jQuery(this).css({'text-decoration': 'underline'})
    })
    z.on('mouseleave', function(e) {
      jQuery(this).css({'text-decoration': 'none'})
    })
  }
  ui.onClick = onClick
  
  _.ui = ui
})(bcjs)

