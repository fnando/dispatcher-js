/*
Rails.js - jQuery Dispatcher for Rails
Copyright (c) 2008 Nando Vieira (simplesideias.com.br)
Dual licensed under the MIT (MIT-LICENSE.txt)
and GPL (GPL-LICENSE.txt) licenses.

Usage: Add this code in your application.html.erb layout file

<html>
	<head>
		<meta name="rails-controller" content="<%= controller.controller_name %>" />
		<meta name="rails-action" content="<%= controller.action_name %>" />
		<%= javascript_include_tag "jquery" %>
		<%= javascript_include_tag "rails" %>
		<%= javascript_include_tag "lib.js" %>
	</head>
</html>

Your lib.js should follow this rule:

Rails.users = {};

Rails["index"] = function() {
	// execute specific code for users/index
};
	
Rails["new"] = function() {
	// execute specific code for users/new
}

Rails-JS also detect the browser and set a body CSS class. If is IE, 
an additional body class identifying the version will be added.
All browsers and IE7+ also add a body class "capable".
*/ 
var Rails = {
	ALIASES: {
		"create": "new",
		"update": "edit"
	},
	
	ua: navigator.userAgent,
	
	init: function() {
		Rails.dispatcher();
		Rails.browserName();
	},
	
	browserName: function() {
		var css_name = null;
		var matches = null;
		var capable = true;

		if (this.ua.match(/firefox/i)) {
			css_name = "firefox";
		} else if (this.ua.match(/safari/i)) {
			css_name = "safari";
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
	
	dispatcher: function() {
		var controller_name = $("head meta[name=rails-controller]").attr("content");
		var action_name = $("head meta[name=rails-action]").attr("content");
		
		action_name = Rails.ALIASES[action_name] || action_name;
		
		// Executed before every controller action
		if (Rails.before) {
			Rails.before();
		}
		
		if (Rails[controller_name]) {
			// Executed before any action from the current controller
			if (Rails[controller_name].before) {
				Rails[controller_name].before();
			}
			
			// The current action per-se
			if (Rails[controller_name][action_name]) {
				Rails[controller_name][action_name]();
			}
		}
	}
};

(function($){
	$.stopEvent = function(e) {
		e.stopPropagation();
		e.preventDefault();
	};
	
	$(document).ready(Rails.init);
})(jQuery);