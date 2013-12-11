// bcjs.ui
;(function(_){
  var ui = Object()
  
  var clickbuster = Object()
  clickbuster.coordinates = []
  
  clickbuster.preventGhostClick = function(x, y) {
    clickbuster.coordinates.push(x, y);
    window.setTimeout(clickbuster.pop, 2500);
  }
  clickbuster.pop = function() {
    clickbuster.coordinates.splice(0, 2);
  }
  clickbuster.onClick = function(event) {
    for (var i = 0; i < clickbuster.coordinates.length; i += 2) {
      var x = clickbuster.coordinates[i];
      var y = clickbuster.coordinates[i + 1];
      if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }
  document.addEventListener('click', clickbuster.onClick, true);
  
  var FastButton = function(element, handler) {
    this.element = Zepto(element)[0]
    this.handler = handler
    
    this.element.addEventListener('touchstart', this, false)
    this.element.addEventListener('click', this, false)
  }
  ui.FastButton = FastButton
  FastButton.prototype.handleEvent = function(event) {
    switch (event.type) {
      case 'touchstart': this.onTouchStart(event); break;
      case 'touchmove': this.onTouchMove(event); break;
      case 'touchend': this.onClick(event); break;
      case 'click': this.onClick(event); break;
    }
  }
  FastButton.prototype.onTouchStart = function(event) {
    event.stopPropagation()
    
    this.element.addEventListener('touchend', this, false)
    document.body.addEventListener('touchmove', this, false)
    
    this.startX = event.touches[0].clientX
    this.startY = event.touches[0].clientY
  }
  FastButton.prototype.onTouchMove = function(event) {
    if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
        Math.abs(event.touches[0].clientY - this.startY) > 10) {
      this.reset()
    }
  }
  FastButton.prototype.onClick = function(event) {
    event.stopPropagation()
    this.reset()
    this.handler(event)
    
    if (event.type == 'touchend') {
      clickbuster.preventGhostClick(this.startX, this.startY);
    }
  }
  FastButton.prototype.reset = function() {
    this.element.removeEventListener('touchend', this, false)
    document.body.removeEventListener('touchmove', this, false)
  }
  
  ui.UniversalFastButton = function(element, handler) {
    if (bcjs.ua.touchable || true) {
      return new bcjs.ui.FastButton(element, handler)
    } else {
      Zepto(element).on('click', handler)
    }
  }
  
  
  _.ui = ui
})(bcjs)

