var bcjs = (function() {
  var _ = Object()
  return _
})()
window.bcjs = bcjs

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

// bcjs.frame
;(function(_){
  var frame = Object()
  
  // a Layer() is a wrapper of a Zepto(), which can be turned on and off
  var Layer = function(Z, idx, f) {
    var z = Zepto(document.createElement('div'))
    z.css({
      'position': 'absolute',
      'width': '100%',
      'height': '100%',
      'overflow': 'auto',
      'z-index': idx 
    })
    Z.append(z)
    z.turnVisible = function() {
      this.css({'display': 'inline'})
    }
    z.turnInvisible = function() {
      this.css({'display': 'none'})
    }
    z.activate = function() {
      this.css({'display': 'inline'})
    }
    z.deactivate = function() {
      this.css({'display': 'none'})
    }
    z.bcjsRemove = function() {
      this.bcjsFrame.removeLayer(this)
    }
    
    z.bcjsFrame = f
    return z
  }
  Layer.prototype = new Zepto()
  frame.Layer = Layer
  
  // a Frame() consists of several Layer()s 
  var Frame = function() {
    this.layers = []
    this.container = undefined
    this.initialized = false
    
    this.db = Object()
  }
  Frame.prototype = {
    setContainer: function(Z) {
      this.container = Z
    },
    initLayers: function() {
      for (var i = 0; i < 2; i++) {
        var lr = new Layer(this.container, i, this)
        lr.turnInvisible()
        this.layers.push(lr)
      }
    },
    addLayer: function() {
      var lr = new Layer(this.container, i, this)
      lr.turnInvisible()
      this.layers.push(lr)
      return lr
    },
    removeLayer: function(lr) {
      if (lr == undefined) {
        this.layers.pop().remove()
      } else {
        var idx = this.layers.indexOf(lr)
        if (idx < 0) {
          console.log('removing nonexistent layer')
          return
        }
        this.layers.splice(idx, 1)[0].remove()
      }
    },
    initialize: function() {
      this.initLayers()
      this.turnVisible()
    },
    getDefaultLayer: function() {
      if (this.layers.length == 0) {
        this.initLayers()
      }
      return this.layers[1]
    },
    
    turnVisible: function() {
      for (var i in this.layers) {
        this.layers[i].turnVisible()
      }
    },
    turnInvisible: function() {
      for (var i in this.layers) {
        this.layers[i].turnInvisible()
      }
    },
    activate: function() {
      this.turnVisible()
    },
    deactivate: function() {
      this.turnInvisible()
    }
  }
  frame.Frame = Frame
  
  // a Group() holds references to several Frame()s, providing switchings
  var Group = function() {
    this.frames = {}
    this.container = undefined
    this.activatingFrame = undefined
  }
  Group.prototype = {
    setContainer: function(Z) {
      this.container = Z
    },
    addFrame: function(f, name) {
      f.container || f.setContainer(this.container)
      this.frames[name] = f
    },
    getFrame: function(name) {
      return this.frames[name]
    },
    activateFrame: function(name) {
      for (var n in this.frames) {
        n == name ? this.frames[n].activate() : this.frames[n].deactivate()
      }
      this.activatingFrame = name
    }
  }
  frame.Group = Group 
  
  _.frame = frame 
})(bcjs)

// bcjs.app
;(function(_){
  var app = Object()
  _.app = app
})(bcjs)

