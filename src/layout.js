// bcjs.layout
;(function(bcjs){
  var layout = bcjs.layout = Object()
  
  layout.cssRefs = {}
  layout.getCSS = function(cssName) {
    if (cssName in this.cssRefs) {
      return this.cssRefs[cssName]
    } else {
      var css = new bcjs.dom.Element('style')
      this.cssRefs[cssName] = css
      document.head.appendChild(css)
    }
  }
  layout.insertCSSRule = function(cssName, ruleText) {
    this.getCSS(cssName).insertRule(ruleText)
  }
  
  layout.applyAppLayout = function() {
    this.documentBody = new bcjs.dom.Element(document.body).setStyle({
      'margin': '0',
      'padding': '0',
      'font-family': '"Helvetica Neue",Helvetica,Arial,sans-serif'
    })
    
    // create a div as the container of the app
    this.appContainer = new bcjs.dom.Element('div').setStyle({
      'position': 'absolute',
      'margin': '0',
      'padding': '0',
      'width': '100%',
      'height': '100%',
      'background': 'gray',
      'overflow': 'auto'
    }).appendTo(this.documentBody)
    
    // store the dimensions
    this.dimensions = {
      appContainerWidth: this.appContainer.getWidth(),
      appContainerHeight: this.appContainer.getHeight(),
      screenWidth: screen.width,
      screenHeight: screen.height
    }
  }
  
})(bcjs)

