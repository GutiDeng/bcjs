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

