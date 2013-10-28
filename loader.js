// bcjs.loader
;(function(_){
  var ScriptLoader = function() {
    this.pathPrefix = '/static/main'
    this.successfulLoads = {}
    this.callbacks = {}
  }
  ScriptLoader.prototype = {
    // dynamic load with callback
    loadScript: function(name, path, callback) {
      if (this.successfulLoads[name]) {
        return
      }
      
      var path = this.makePath(path)
      
      this.callbacks[name] = callback
      
      var script = document.createElement('script')
      script.src = path
      document.body.appendChild(script)
    },

    // loaded scripts call this method to invoke callback
    afterLoad: function(name) {
      this.successfulLoads[name] = true
      this.callbacks[name] && this.callbacks[name]()
    },
    
    // client codes can set pathPrefix to address their layouts
    makePath: function(path) {
      var p = this.pathPrefix.slice(-1) == '/' || path.slice(0, 1) == '/' ?
        this.pathPrefix + path :
        this.pathPrefix + '/' + path
      
      if (p.slice(-3) != '.js')
        p = p + '.js'
      
      return p
    }
  }
  
  _.loader = new ScriptLoader()
})(bcjs)

