// Dispatcher.js - jQuery Dispatcher
// Copyright (c) 2008-2010 Nando Vieira (simplesideias.com.br)
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
		Dispatcher.browserName();
	},

	browserName: function() {
		var css_name = null;
		var matches = null;
		var capable = true;

		if (this.ua.match(/firefox/i)) {
			css_name = "firefox";
		} else if (this.ua.match(/chrome/i)) {
			css_name = "chrome webkit";
		} else if (this.ua.match(/iphone/i)) {
			css_name = "safari iphone webkit";
		} else if (this.ua.match(/ipad/i)) {
			css_name = "safari ipad webkit";
		} else if (this.ua.match(/safari/i)) {
			css_name = "safari webkit";
		} else if (matches = this.ua.match(/msie (\d+)/i)) {
			css_name = "ie ie" + matches[1];
			capable = parseInt(matches[1] || 0) >= 7;
		} else if (this.ua.match(/opera/i)) {
			css_name = "opera";
		} else if (this.ua.match(/mozilla/i)) {
			css_name = "mozilla";
		}

		if (css_name) {
			$("body")
				.addClass("has-js")
				.addClass(css_name)
				.addClass(capable? "capable" : "");
			return css_name;
		}
	},

	run: function() {
		var page = $("head meta[name=page]").attr("content").toString().split("#");
		var controller_name = page[0];
		var action_name = page[1];

		action_name = Dispatcher.ALIASES[action_name] || action_name;

		// Executed before every controller action
		if (App.before) {
			App.before();
		}

		if (App[controller_name]) {
			// Executed before any action from the current controller
			if (App[controller_name].before) {
				App[controller_name].before();
			}

			// The current action per-se
			if (App[controller_name][action_name]) {
				App[controller_name][action_name]();
			}

			// The after callback for the current controller
      		if (App[controller_name].after) {
				App[controller_name].after();
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