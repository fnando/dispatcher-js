function prepare() {
  $("meta[name=page]").remove();
  $("head").append('<meta name="page" content="" />');
  Dispatcher.run();
  App.sample = {};
};

new Test.Unit.Runner({
  setup: function() {
    prepare();
    $("meta[name=page]").attr("content", "");
    App.sample = {};
    Dispatcher.before = null;
  },

  teardown: function() {
  },

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
