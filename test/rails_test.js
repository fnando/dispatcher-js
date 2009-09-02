function prepare(ua) {
	$("body").removeAttr("class");
	Rails.ua = ua;
	Rails.init();
};

new Test.Unit.Runner({
	setup: function() {
		prepare(navigator.userAgent);
		$("meta[name*=rails]").attr("content", "");
		Rails.sample = {};
		Rails.before = null;
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
		
		Rails.before = function() { triggered = true; }
		Rails.dispatcher();
		assert(triggered);
	}},
	
	// Dispatch controller's before callback
	testDispatchControllerBeforeCallback: function() { with(this) {
		var triggered = null;
		
		Rails.sample.before = function() { triggered = true; }
		$("meta[name=rails-controller]").attr("content", "sample");
		Rails.dispatcher();
		assert(triggered);
	}},

	// Dispatch controller's action callback
	testDispatchControllerActionCallback: function() { with(this) {
		var triggered = null;
		
		Rails.sample.index = function() { triggered = true; }
		$("meta[name=rails-controller]").attr("content", "sample");
		$("meta[name=rails-action]").attr("content", "index");
		
		Rails.dispatcher();
		assert(triggered);
	}},

	// Dispatch the chain
	testDispatchTheChain: function() { with(this) {
		var triggers = [];
		
		Rails.before = function() { triggers.push("before"); }
		Rails.sample.before = function() { triggers.push("before-controller"); }
		Rails.sample.index = function() { triggers.push("action"); }
		
		$("meta[name=rails-controller]").attr("content", "sample");
		$("meta[name=rails-action]").attr("content", "index");
		
		Rails.dispatcher();
		assertEqual("before, before-controller, action", triggers.join(", "));
	}},

	// Dispatch create action as new
	testDispatchCreateActionAsNew: function() { with(this) {
		var triggered = null;
		
		Rails.sample["new"] = function() { triggered = true; }
		
		$("meta[name=rails-controller]").attr("content", "sample");
		$("meta[name=rails-action]").attr("content", "create");
		
		Rails.dispatcher();
		assert(triggered);
	}},

	// Dispatch update action as edit
	testDispatchUpdateActionAsEdit: function() { with(this) {
		var triggered = null;
		
		Rails.sample["edit"] = function() { triggered = true; }
		
		$("meta[name=rails-controller]").attr("content", "sample");
		$("meta[name=rails-action]").attr("content", "update");
		
		Rails.dispatcher();
		assert(triggered);
	}},
});