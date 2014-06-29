;(function(window) {
  var bcjs = {}
  window.bcjs = bcjs
})(window);

;(function(window, bcjs) {
  var ajax = {}
  bcjs.ajax = ajax
})(window, bcjs);

;(function(window, bcjs, ajax) {
  var emptyFunction = function() {}
  
  var buildCfg = function(cfg) {
    var _cfg = {
      method: 'GET',
      url: '',
      query: {},
      data: undefined,
      parseAs: 'JSON',
      callback: undefined,
      callbackOnError: undefined
    }
    for (var k in cfg) {
      _cfg[k] = cfg[k]
    }
    return _cfg
  }
  
  var go = function(cfg) {
    var cfg = buildCfg(cfg)
    
    cfg.requestURI = encodeURI(cfg.url)
    if (cfg.query) {
      var uri = cfg.url + '?'
      for (var k in cfg.query) {
        uri += encodeURIComponent(k) + '=' + encodeURIComponent(cfg.query[k]) + '&'
      }
      cfg.requestURI = uri
    }
    
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = ajax.emptyFunction;
        
        var responseParsed, error
        
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          try {
            if (cfg.parseAs == 'JSON') {
              responseParsed = JSON.parse(xhr.responseText)
            }
          } catch (e) { error = e }
          
          if (error) {
            cfg.callbackOnError && cfg.callbackOnError.call(null, 'parse', cfg, xhr)
          }
          else {
            cfg.callback && cfg.callback.call(null, responseParsed, cfg, xhr)
          }
        } else {
          cfg.callbackOnError && cfg.callbackOnError.call(null, 'status', cfg, xhr)
        }
      }
    }
    xhr.open(cfg.method, cfg.requestURI, true)
    cfg.data && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(cfg.data || null)
  }
  
  ajax.go = go
})(window, bcjs, ajax);

;(function(window, bcjs) {
  var browser = {}
  bcjs.browser = browser
})(window, bcjs);

;(function(window, bcjs, browser) {
  // this file is buggy...
  
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
  cookie.get = function (name) {
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(name + "=");
      if (c_start != -1) {
        c_start = c_start + name.length + 1;
        c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = document.cookie.length;
        }
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
  }
  browser.cookie = cookie
})(window, bcjs, browser);

