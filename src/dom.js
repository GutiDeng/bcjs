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
      this.element.removeEventListener('touchstart', this.bcjsTouchstartHandler)
      this.element.removeEventListener('touchend', this.bcjsTouchendHandler)
      this.element.removeEventListener('mouseup', this.bcjsMouseupHandler)
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
        'cursor': 'pointer'
      })
      this.bcjsOnClickHandler = handler
      
      this.bcjsMouseupHandler = function(e) {
        if (this.bcjsDomElement.bcjsOnClickHandler) {
          this.bcjsDomElement.bcjsOnClickHandler.call(this.bcjsDomElement, e) && e.stopPropagation()
        } else {
          console.log('mouseup but no bcjsOnClickHandler')
        }
      }
      this.element.addEventListener('mouseup', this.bcjsMouseupHandler)
      
      this.bcjsTouchstartHandler = function(e) {
        this.bcjsDomElement.bcjsOnClickStartX = e.changedTouches[0].clientX
        this.bcjsDomElement.bcjsOnClickStartY = e.changedTouches[0].clientY
        this.bcjsDomElement.bcjsOnClickStartT = (new Date()).getTime()
      }
      this.element.addEventListener('touchstart', this.bcjsTouchstartHandler)
      
      this.bcjsTouchendHandler = function(e) {
        e.preventDefault()
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
        
        this.bcjsDomElement.bcjsOnClickHandler.call(this.bcjsDomElement, e) && e.stopPropagation()
      }
      this.element.addEventListener('touchend', this.bcjsTouchendHandler)
      
      return this
    }
  }
  
  bcjs.dom = dom
})(bcjs)
