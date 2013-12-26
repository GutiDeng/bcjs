// bcjs.dom
;(function(bcjs){
  var dom = Object()
  
  dom.Element = function(tagName) {
    if (tagName instanceof Element) {
      this.element = tagName
    } else {
      this.element = document.createElement(tagName)
    }
    this.element.bcjsDomElement = this
  }
  
  dom.Element.prototype = {
    hide: function() {
      this.setStyle({'display': 'none'})
      return this
    },
    show: function() {
      this.setStyle({'display': undefined})
      return this
    },
    getWidth: function() {
      return this.element.getBoundingClientRect().width
    },
    getHeight: function() {
      return this.element.getBoundingClientRect().height
    },
    getZIndex: function() {
      return window.getComputedStyle(this.element)['z-index']
    },
    setStyle: function(obj) {
      for (var k in obj) {
        var v = obj[k]
        if (v === undefined) {
          this.element.style.removeProperty(k)
        } else {
          this.element.style.setProperty(k, v)
        }
      }
      return this
    },
    setAttr: function(obj) {
      for (var k in obj) {
        var v = obj[k]
        if (v === undefined) {
          this.element.removeAttribute(k)
        } else {
          this.element.setAttribute(k, v)
        }
      }
      return this
    },
    setHTML: function(html) {
      this.element.innerHTML = html
      return this
    },
    append: function(child) {
      this.element.appendChild(child.element)
      if (this.children === undefined) {
        this.children = []
      }
      this.children.push(child)
      return this
    },
    appendTo: function(parentElement) {
      parentElement.append(this)
      return this
    },
    empty: function() {
      this.element.innerHTML = ''
      return this
    },
    remove: function() {
      if (this.element.parentNode != null)
        this.element.parentNode.removeChild(this.element)
      return this
    },
    
    getChildren: function() {
      if (this.children === undefined) {
        return []
      }
      return this.children
    },
    
    
    offClick: function() {
      if (!this.bcjsOnClickHandler) {
        return
      }
      this.setStyle({
        'cursor': undefined
      })
      this.bcjsOnClickHandler = undefined
      this.element.removeEventListener('touchstart', this.bcjsTouchStartHandler)
      this.element.removeEventListener('touchend', this.bcjsTouchEndHandler)
      this.element.removeEventListener('mouseup', this.bcjsMouseUpHandler)
      this.element.removeEventListener('mousedown', this.bcjsMouseDownHandler)
      return this
    },
    onClick: function(handler) {
      /*
      if (this.bcjsOnClickHandler) {
        this.offClick()
        this.onClick(handler)
      }
      */
      this.setStyle({
        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
        'cursor': 'pointer'
      })
      this.bcjsOnClickHandler = handler
      
      this.bcjsMouseDownHandler = function(e) {
        if (this.bcjsOnClickEventType && this.bcjsOnClickEventType == 'touch') {
          return
        }
        //e.preventDefault()
        //e.stopPropagation()
      }
      this.element.addEventListener('mousedown', this.bcjsMouseDownHandler)
        
      this.bcjsMouseUpHandler = function(e) {
        if (this.bcjsDomElement.bcjsOnClickEventType && this.bcjsDomElement.bcjsOnClickEventType == 'touch') {
          return
        }
        var caught = this.bcjsDomElement.bcjsOnClickHandler.call(this.bcjsDomElement, e)
        if (caught) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      this.element.addEventListener('mouseup', this.bcjsMouseUpHandler)
      
      this.bcjsTouchStartHandler = function(e) {
        this.bcjsDomElement.bcjsOnClickEventType = 'touch'
        this.bcjsDomElement.bcjsOnClickStartX = e.changedTouches[0].clientX
        this.bcjsDomElement.bcjsOnClickStartY = e.changedTouches[0].clientY
        this.bcjsDomElement.bcjsOnClickStartT = (new Date()).getTime()
      }
      this.element.addEventListener('touchstart', this.bcjsTouchStartHandler)
      
      this.bcjsTouchEndHandler = function(e) {
        var x = e.changedTouches[0].clientX
        var y = e.changedTouches[0].clientY
        var t = (new Date()).getTime()
        
        if (Math.abs(x - this.bcjsDomElement.bcjsOnClickStartX) > 5) {
          return
        }
        if (Math.abs(y - this.bcjsDomElement.bcjsOnClickStartY) > 5) {
          return
        }
        if (Math.abs(t - this.bcjsDomElement.bcjsOnClickStartT) > 300) {
          return
        }
        
        var caught = this.bcjsDomElement.bcjsOnClickHandler.call(this.bcjsDomElement, e)
        if (caught) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      this.element.addEventListener('touchend', this.bcjsTouchEndHandler)
      
      return this
    }
  }
  
  bcjs.dom = dom
})(bcjs)

