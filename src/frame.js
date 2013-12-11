// bcjs.frame
;(function(_){
  var frame = Object()
  
  // A Layer() is a `div' element wrapped by jQuery, plus additional functions.
  var Layer = function(container, zIndex, belongsTo) {
    var z = jQuery(document.createElement('div'))
    z.css({
      'position': 'absolute',
      'width': '100%',
      'height': '100%',
      'overflow': 'auto',
      'z-index': zIndex
    })
    container.append(z)
    z.turnVisible = function() {
      this.css({'display': 'inline'})
    }
    z.turnInvisible = function() {
      this.css({'display': 'none'})
    }
    z.activate = function() {
      this.turnVisible()
    }
    z.deactivate = function() {
      this.turnInvisible()
    }
    z.bcjsRemove = function() {
      this.belongsTo.removeLayer(this)
    }
    
    z.belongsTo = belongsTo
    z.deactivate()
    return z
  }
  Layer.prototype = new jQuery()
  frame.Layer = Layer
  
  // A Frame() consists of several Layer()s.
  var Frame = function(zIndex) {
    this.layers = Array(10)
    this.zIndex = zIndex || 0
    this.container = undefined
    this.initialized = false
    
    this.db = Object()
  }
  Frame.prototype = {
    setContainer: function(Z) {
      this.container = Z
    },
    initLayer: function(localIndex) {
      if (this.layers[localIndex]) {
        console.log('Reinitializing existing layer. Ignore. localIndex: ' + localIndex)
        return
      }
      var lr = new Layer(this.container, this.zIndex * 10 + localIndex, this)
      this.layers[localIndex] = lr
      return lr
    },
    initLayers: function() {
      for (var i = 0; i <= 2; i++) {
        this.initLayer(i)
      }
    },
    addLayer: function() {
      var localIndex = undefined
      for (var i = this.layers.length; i >= 0; i--) {
        if (this.layers[i] == undefined) {
          localIndex = i
        } else {
          break
        }
      }
      return this.initLayer(localIndex)
    },
    removeLayer: function(lr) {
      var localIndex = this.layers.indexOf(lr)
      if (localIndex < 0) {
        console.log('Removing nonexistent layer. Ignore.')
        return
      }
      this.layers[localIndex].remove()
      this.layers[localIndex] = undefined
      //this.layers.splice(idx, 1)[0].remove()
    },
    initialize: function() {
      this.initLayers()
      this.turnVisible()
    },
    getLayer: function(localIndex) {
      if (localIndex == undefined) {
        for (var i = this.layers.length; i >= 0; i--) {
          if (this.layers[i]) {
            localIndex = i
            break
          }
        }
      } 
      if (this.layers[localIndex] == undefined) {
        console.log('Getting undefined layer. Ignore. localIndex:', localIndex)
        return
      }
      return this.layers[localIndex]
    },
    
    turnVisible: function() {
      for (var i in this.layers) {
        this.layers[i] && this.layers[i].turnVisible()
      }
    },
    turnInvisible: function() {
      for (var i in this.layers) {
        this.layers[i] && this.layers[i].turnInvisible()
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
    },
    deactivateFrame: function(name) {
      this.frames[name].deactivate()
      if (this.activatingFrame == name) {
        this.activatingFrame = undefined
      }
    }
  }
  frame.Group = Group 
  
  _.frame = frame 
})(bcjs)

