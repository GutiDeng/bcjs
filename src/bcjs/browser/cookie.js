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
