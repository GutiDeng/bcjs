// bcjs.ui
;(function(_){
  var ui = Object()
  
  var RollingView = function(cfg) {
    var cfg = cfg || {}
    cfg.pagePctWidth = cfg.pagePctWidth || 60
    this.cfg = cfg
    
    this.container = undefined
    this.pages = new Array()
    this.coverLayers = new Array()
    this.contentLayers = new Array()
    
    this.activeIndex = 0
    this.offsets = []
    this.zindexes = []
    this.covers = []
  }
  RollingView.prototype = {
    setContainer: function(container) {
      container.setStyle({
        'overflow': 'hidden'
      })
      this.container = container
      return this
    },
    addCoverLayer: function(page) {
      var layer = new bcjs.dom.Element('div').setStyle({
        'position': 'absolute',
        'width': '100%',
        'height': '100%'
      }).appendTo(page)
      this.coverLayers.push(layer)
      return layer
    },
    addContentLayer: function(page) {
      var layer = new bcjs.dom.Element('div').setStyle({
        'overflow': 'auto',
        'position': 'absolute',
        'width': '100%',
        'height': '100%'
      }).appendTo(page)
      this.contentLayers.push(layer)
      return layer
    },
    addPage: function() {
      var page = new bcjs.dom.Element('div').setStyle({
        'background': 'white',
        'position': 'absolute',
        'width': this.cfg.pagePctWidth + '%',
        'height': this.containerHeight() + 'px'
      }).appendTo(this.container)
      this.pages.push(page)
      var coverLayer = this.addCoverLayer(page)
      var contentLayer = this.addContentLayer(page)
      return contentLayer
    },
    containerWidth: function() {
      return this.container.getWidth()
    },
    containerHeight: function() {
      return this.container.getHeight()
    },
    calculateOffsets: function() {
      this.offsets = new Array(this.pages.length)
      var containerWidth = this.containerWidth()
      var pageWidthRatio = this.cfg.pagePctWidth / 100
      var pageWidth = containerWidth * pageWidthRatio
      
      var step = (containerWidth - pageWidth) / (this.pages.length - 1)
      for (var i = 0; i < this.pages.length; i++) {
        this.offsets[i] = step * i
      }
    },
    applyOffsets: function() {
      for (var i = 0; i < this.pages.length; i++) {
        this.pages[i].setStyle({
          'left': this.offsets[i] + 'px'
        })
      }
    },
    calculateZIndexes: function() {
      var containerZIndex = this.container.getZIndex()
      for (var i = 0; i < this.pages.length; i++) {
        this.zindexes[i] = containerZIndex - Math.abs(this.activeIndex - i)
      }
    },
    applyZIndexes: function() {
      for (var i = 0; i < this.pages.length; i++) {
        this.pages[i].setStyle({
          'z-index': this.zindexes[i]
        })
      }
    },
    calculateCovers: function() {
      for (var i = 0; i < this.pages.length; i++) {
        if (i == this.activeIndex) {
          this.covers[i] = [undefined, undefined]
        } else {
          this.covers[i] = ['#000000', 0.4 + 0.1 * Math.abs(i - this.activeIndex)]
        }
      }
    },
    applyCovers: function() {
      for (var i = 0; i < this.pages.length; i++) {
        var background = this.covers[i][0], opacity = this.covers[i][1]
        this.coverLayers[i].setStyle({
          'background': background,
          'opacity': opacity
        })
      }
    },
    ensureClickHandlings: function() {
      var _ = this
      var handler = function(e) {
        _.activatePageByIndex(this.bcjsRollingViewIndex)
      }
      for (var i = 0; i < this.pages.length; i++) {
        this.pages[i].bcjsRollingViewIndex = i
        if (this.activeIndex == i) {
          this.pages[i].offClick()
        } else {
          this.pages[i].onClick(handler)
        }
      }
    },
    render: function() {
      this.calculateOffsets()
      this.applyOffsets()
      this.calculateZIndexes()
      this.applyZIndexes()
      this.calculateCovers()
      this.applyCovers()
      this.ensureClickHandlings()
    },
    activatePageByIndex: function(index) {
      if (index >= this.pages.length || index < 0 || index === undefined) {
        return
      }
      this.activeIndex = index
      this.render()
    },
    activatePageNext: function() {
      this.activatePageByIndex(this.activeIndex + 1)
    },
    activatePagePrevious: function() {
      this.activatePageByIndex(this.activeIndex - 1)
    }
  }
  ui.RollingView = RollingView
  
  _.ui = ui
})(bcjs)

