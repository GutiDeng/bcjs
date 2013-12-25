// bcjs.app
;(function(_){
  var app = Object()
  
  app.colors = {}
  app.getColor = function(name) {
    if (name in this.colors) {
      return this.colors[name]
    } else {
      return '#000000'
    }
  }
  app.putColor = function(name, value) {
    if (value) {
      this.colors[name] = value
    } else {
      // first argument will be a dictionary
      var dict = name
      for (var k in dict) {
        this.colors[k] = dict[k]
      }
    }
  }
  _.app = app
})(bcjs)

