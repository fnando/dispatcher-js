/*
 Rails.js 0.0.1 - jQuery Dispatcher for Rails
 Copyright (c) 2008 Nando Vieira (simplesideias.com.br)
 Dual licensed under the MIT (MIT-LICENSE.txt)
 and GPL (GPL-LICENSE.txt) licenses.
*/

/*
Usage: Add this code in your application.html.erb layout file

<html>
   <head>
       <meta name="rails-controller" content="<%= response.controller_name %>" />
       <meta name="rails-action" content="<%= response.action_name %>" />
       <%= javascript_include_tag 'jquery' %>
       <%= javascript_include_tag 'rails' %>
       <%= javascript_include_tag 'lib.js' %>
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
*/ 
var Rails = {
    ALIASES: {
        'create': 'new',
        'update': 'edit'
    },
    
    dispatcher: function() {
        var controller_name = $('head meta[name=rails-controller]').attr('content');
        var action_name = $('head meta[name=rails-action]').attr('content');
        
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

$(document).ready(Rails.dispatcher);