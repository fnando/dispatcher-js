function prepare(ua) {
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

	// Detect Firefox
	testDetectFirefox: function() { with(this) {
		prepare("Firefox");
		assertEqual(1, $("body.capable").length);
		assertEqual(1, $("body.firefox").length);
		assertEqual(1, $("body.has-js").length);
	}},

	// Detect Safari
	testDetectSafari: function() { with(this) {
		prepare("Safari");
		assertEqual(1, $("body.capable").length);
		assertEqual(1, $("body.safari").length);
		assertEqual(1, $("body.has-js").length);
	}},

	// Detect Chrome
	testDetectChrome: function() { with(this) {
		prepare("Chrome");
		assertEqual(1, $("body.capable").length);
		assertEqual(1, $("body.chrome").length);
		assertEqual(1, $("body.safari").length);
		assertEqual(1, $("body.has-js").length);
	}},

	// Detect Opera
	testDetectOpera: function() { with(this) {
		prepare("Opera");
		assertEqual(1, $("body.capable").length);
		assertEqual(1, $("body.opera").length);
		assertEqual(1, $("body.has-js").length);
	}},

	// Detect IE6
	testDetectIE6: function() { with(this) {
		prepare("MSIE 6.0");
		assertEqual(0, $("body.capable").length);
		assertEqual(1, $("body.ie").length);
		assertEqual(1, $("body.ie6").length);
		assertEqual(1, $("body.has-js").length);
	}},

	// Detect IE7
	testDetectIE7: function() { with(this) {
		prepare("MSIE 7.0");
		assertEqual(1, $("body.capable").length);
		assertEqual(1, $("body.ie").length);
		assertEqual(1, $("body.ie7").length);
		assertEqual(1, $("body.has-js").length);
	}},

	// Detect IE8
	testDetectIE8: function() { with(this) {
		prepare("MSIE 8.0");
		assertEqual(1, $("body.capable").length);
		assertEqual(1, $("body.ie").length);
		assertEqual(1, $("body.ie8").length);
		assertEqual(1, $("body.has-js").length);
	}},

	// Detect Mozilla
	testDetectMozilla: function() { with(this) {
		prepare("Mozilla");
		assertEqual(1, $("body.capable").length);
		assertEqual(1, $("body.mozilla").length);
		assertEqual(1, $("body.has-js").length);
	}},

	// Prevent event and propagation
	testPreventEventAndPropagation: function() { with(this) {
		var containerTriggered = null;
		var linkTriggered = null;

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
});