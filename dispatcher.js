// Dispatcher.js - jQuery Dispatcher
// Copyright (c) 2008-2011 Nando Vieira (nandovieira.com.br)
// Dual licensed under the MIT (MIT-LICENSE.txt)
// and GPL (GPL-LICENSE.txt) license

if (!window.App) {
  var App = {};
}

var Dispatcher = {
  ALIASES: {
    "create": "new",
    "update": "edit",
    "destroy": "remove"
  },

  ua: navigator.userAgent,

  init: function() {
    Dispatcher.run();
    Dispatcher.setBrowserInfo();
  },

  detectIE: function(minimumVersion, callback) {
    var matches = this.ua.match(/MSIE (\d+)/)
      , version = parseInt(matches[1], 10)
    ;

    if (!matches) { return; }

    if (version < minimumVersion) {
      callback(version, minimumVersion);
    };
  },

  setBrowserInfo: function() {
    $("body")
      .removeClass("no-js")
      .addClass("js")
      .addClass(this.browserInfo().join(" "))
    ;
  },

  browserInfo: function() {
    var meta = ["non-ie"]
      , matches = null
    ;

    if (this.ua.match(/firefox/i)) {
      meta.push("firefox");
    } else if (this.ua.match(/chrome/i)) {
      $.merge(meta, ["chrome", "webkit"]);
    } else if (this.ua.match(/iphone/i)) {
      $.merge(meta, ["safari", "iphone", "webkit"]);
    } else if (this.ua.match(/ipad/i)) {
      $.merge(meta, ["safari", "ipad", "webkit"]);
    } else if (this.ua.match(/safari/i)) {
      $.merge(meta, ["safari", "webkit"]);
    } else if ((matches = this.ua.match(/MSIE (\d+)/))) {
      var version = parseInt(matches[1], 10);

      meta.shift();
      $.merge(meta, ["ie", "ie" + version]);

      if (version < 9) {
        meta.push("lt-ie9");
      }

      if (version < 8) {
        meta.push("lt-ie8");
      }
    } else if (this.ua.match(/opera/i)) {
      meta.push("opera");
    } else if (this.ua.match(/mozilla/i)) {
      meta.push("mozilla");
    }

    return meta;
  },

  run: function() {
    var meta = $("head meta[name=page]")
      , noMeta = 'No meta tag found. Use something like <meta name="page" content="controller#action" />'
    ;

    if (meta.length === 0) {
      throw(noMeta);
    }

    var page = meta.attr("content").toString().split("#")
      , controllerName = page[0]
      , actionName = page[1]
    ;

    actionName = Dispatcher.ALIASES[actionName] || actionName;

    // Executed before every controller action
    if (App.before) {
      App.before();
    }

    if (App[controllerName]) {
      // Executed before any action from the current controller
      if (App[controllerName].before) {
        App[controllerName].before();
      }

      // The current action per-se
      if (App[controllerName][actionName]) {
        App[controllerName][actionName]();
      }

      // The after callback for the current controller
      if (App[controllerName].after) {
        App[controllerName].after();
      }
    }

    if (App.after) {
      App.after();
    }
  }
};

(function($){
  $.stopEvent = function(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  $(document).ready(Dispatcher.init);
})(jQuery);
