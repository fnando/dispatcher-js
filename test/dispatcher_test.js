function prepare(ua) {
  $("meta[name=page]").remove();
  $("head").append('<meta name="page" content="" />');
  $("body").removeAttr("class");
  Dispatcher.ua = ua;
  Dispatcher.init();
  App.sample = {};
};

new Test.Unit.Runner({
  setup: function() {
    prepare(navigator.userAgent);
    $("meta[name=page]").attr("content", "");
    App.sample = {};
    Dispatcher.before = null;
  },

  teardown: function() {
  },

  // Return browser info
  testReturnBrowserInfo: function() { with(this) {
    prepare("iPad");
    var meta = Dispatcher.browserInfo();

    assertEqual(4, meta.length);
    assertEqual("non-ie", meta[0]);
    assertEqual("safari", meta[1]);
    assertEqual("ipad", meta[2]);
    assertEqual("webkit", meta[3]);
  }},

  // Detect Firefox
  testDetectFirefox: function() { with(this) {
    prepare("Firefox");
    assertEqual(1, $("body.firefox").length);
    assertEqual(1, $("body.non-ie").length);
    assertEqual(1, $("body.js").length);
  }},

  // Detect Safari
  testDetectSafari: function() { with(this) {
    prepare("Safari");
    assertEqual(1, $("body.safari").length);
    assertEqual(1, $("body.webkit").length);
    assertEqual(1, $("body.non-ie").length);
    assertEqual(1, $("body.js").length);
  }},

  // Detect iPhone
  testDetectiPhone: function() { with(this) {
    prepare("iPhone");
    assertEqual(1, $("body.iphone").length);
    assertEqual(1, $("body.safari").length);
    assertEqual(1, $("body.webkit").length);
    assertEqual(1, $("body.non-ie").length);
    assertEqual(1, $("body.js").length);
  }},

  // Detect iPad
  testDetectiPad: function() { with(this) {
    prepare("iPad");
    assertEqual(1, $("body.ipad").length);
    assertEqual(1, $("body.safari").length);
    assertEqual(1, $("body.webkit").length);
    assertEqual(1, $("body.non-ie").length);
    assertEqual(1, $("body.js").length);
  }},

  // Detect Chrome
  testDetectChrome: function() { with(this) {
    prepare("Chrome");
    assertEqual(1, $("body.chrome").length);
    assertEqual(1, $("body.webkit").length);
    assertEqual(1, $("body.non-ie").length);
    assertEqual(1, $("body.js").length);
  }},

  // Detect Opera
  testDetectOpera: function() { with(this) {
    prepare("Opera");
    assertEqual(1, $("body.opera").length);
    assertEqual(1, $("body.non-ie").length);
    assertEqual(1, $("body.js").length);
  }},

  // Detect IE6
  testDetectIE6: function() { with(this) {
    prepare("MSIE 6.0");
    assertEqual(1, $("body.ie").length);
    assertEqual(1, $("body.ie6").length);
    assertEqual(0, $("body.non-ie").length);
    assertEqual(1, $("body.js").length);
    assertEqual(1, $("body.lt-ie9").length);
    assertEqual(1, $("body.lt-ie8").length);
  }},

  // Detect IE7
  testDetectIE7: function() { with(this) {
    prepare("MSIE 7.0");
    assertEqual(1, $("body.ie").length);
    assertEqual(1, $("body.ie7").length);
    assertEqual(0, $("body.non-ie").length);
    assertEqual(1, $("body.js").length);
    assertEqual(1, $("body.lt-ie9").length);
    assertEqual(1, $("body.lt-ie8").length);
  }},

  // Detect IE8
  testDetectIE8: function() { with(this) {
    prepare("MSIE 8.0");
    assertEqual(1, $("body.ie").length);
    assertEqual(1, $("body.ie8").length);
    assertEqual(0, $("body.non-ie").length);
    assertEqual(1, $("body.js").length);
    assertEqual(1, $("body.lt-ie9").length);
    assertEqual(0, $("body.lt-ie8").length);
  }},

  // Detect IE9
  testDetectIE9: function() { with(this) {
    prepare("MSIE 9.0");
    assertEqual(1, $("body.ie").length);
    assertEqual(1, $("body.ie9").length);
    assertEqual(0, $("body.non-ie").length);
    assertEqual(1, $("body.js").length);
    assertEqual(0, $("body.lt-ie9").length);
    assertEqual(0, $("body.lt-ie8").length);
  }},

  // Detect Mozilla
  testDetectMozilla: function() { with(this) {
    prepare("Mozilla");
    assertEqual(1, $("body.mozilla").length);
    assertEqual(1, $("body.js").length);
  }},

  // Detect required IE version
  testDetectRequiredIEVersion: function() { with(this) {
    var args = {}
      , handler = function(currentVersion, requiredVersion) {
        args = {current: currentVersion, required: requiredVersion};
      }
    ;

    prepare("MSIE 8.0");
    Dispatcher.detectIE(8, handler);
    assertEqual(undefined, args.current);
    assertEqual(undefined, args.required);

    prepare("MSIE 7.0");
    Dispatcher.detectIE(8, handler);
    assertEqual(7, args.current);
    assertEqual(8, args.required);
  }},

  // Prevent event and propagation
  testPreventEventAndPropagation: function() { with(this) {
    var containerTriggered = null
      , linkTriggered = null
    ;

    $("#sample-container").click(function(){
      containerTriggered = true;
    });

    $("#sample-container a").click(function(e){
      $.stopEvent(e);
      linkTriggered = true;
    });

    $("#sample-container a").trigger("click");

    assert(linkTriggered);
    assertNull(containerTriggered);
  }},

  // Dispatch before callback
  testDispatchBeforeCallback: function() { with(this) {
    var triggered = null;

    App.before = function() { triggered = true; }
    Dispatcher.run();
    assert(triggered);
  }},

  // Dispatch after callback
  testDispatchAfterCallback: function() { with(this) {
    var triggered = null;

    App.after = function() { triggered = true; }
    Dispatcher.run();
    assert(triggered);
  }},

  // Dispatch controller after callback
  testDispatchControllerAfterCallback: function() { with(this) {
    var triggered = null;

    App.sample.after = function() { triggered = true; }
    $("meta[name=page]").attr("content", "sample");
    Dispatcher.run();
    assert(triggered);
  }},

  // Dispatch controller's before callback
  testDispatchControllerBeforeCallback: function() { with(this) {
    var triggered = null;

    App.sample.before = function() { triggered = true; }
    $("meta[name=page]").attr("content", "sample");
    Dispatcher.run();
    assert(triggered);
  }},

  // Dispatch controller's action callback
  testDispatchControllerActionCallback: function() { with(this) {
    var triggered = null;

    App.sample.index = function() { triggered = true; }
    $("meta[name=page]").attr("content", "sample#index");

    Dispatcher.run();
    assert(triggered);
  }},

  // Dispatch the chain
  testDispatchTheChain: function() { with(this) {
    var triggers = [];

    App.before = function() { triggers.push("before"); }
    App.after = function() { triggers.push("after"); }
    App.sample.before = function() { triggers.push("before-controller"); }
    App.sample.index = function() { triggers.push("action"); }
    App.sample.after = function() { triggers.push("after-controller"); }

    $("meta[name=page]").attr("content", "sample#index");

    Dispatcher.run();
    assertEqual("before, before-controller, action, after-controller, after", triggers.join(", "));
  }},

  // Dispatch create action as new
  testDispatchCreateActionAsNew: function() { with(this) {
    var triggered = null;

    App.sample["new"] = function() { triggered = true; }

    $("meta[name=page]").attr("content", "sample#create");

    Dispatcher.run();
    assert(triggered);
  }},

  // Dispatch destroy action as remove
  testDispatchDestroyActionAsRemove: function() { with(this) {
    var triggered = null;

    App.sample["remove"] = function() { triggered = true; }

    $("meta[name=page]").attr("content", "sample#destroy");

    Dispatcher.run();
    assert(triggered);
  }},

  // Dispatch update action as edit
  testDispatchUpdateActionAsEdit: function() { with(this) {
    var triggered = null;

    App.sample["edit"] = function() { triggered = true; }

    $("meta[name=page]").attr("content", "sample#update");

    Dispatcher.run();
    assert(triggered);
  }},

  // Raise error when no meta tag is found.
  testRaiseErrorWhenNoMetaTagIsFound: function() { with(this) {
    $("meta[name=page]").remove();
    assertRaise(null, Dispatcher.run);
  }}
});
