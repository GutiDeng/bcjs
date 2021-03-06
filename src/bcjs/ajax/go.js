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

