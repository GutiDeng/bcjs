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
  
  _.layout = layout
})(bcjs)

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

// bcjs.app
;(function(_){
  var app = Object()
  
  app.colors = {}
  app.getColor = function(name) {
    if (name in this.colors) {
      return this.colors[name]
    } else {
      console.log('missing color: ', name)
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

// bcjs.ua
;(function(_){
  var ua = Object()
  
  ua.touchable = true
  //ua.touchable = jQuery.os.phone || jQuery.os.tablet ? true : false
  
  _.ua = ua
})(bcjs)

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

// bcjs.cookie
;(function(_){
  var cookie = Object()
  
  cookie.set = function (name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toGMTString();
    } else {
      var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }
  cookie.get = function getCookie(c_name) {
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + "=");
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = document.cookie.length;
        }
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
  }
  
  _.cookie = cookie
})(bcjs)

