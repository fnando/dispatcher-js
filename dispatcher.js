var Dispatcher = (function(){
  "use strict";

  function Dispatcher(app, controller, action) {
    this.app = app || {};
    this.controller = controller;
    this.action = action;
  }

  Dispatcher.ALIASES = {
      "update": "edit"
    , "create": "new"
    , "destroy": "remove"
  };

  Dispatcher.errorReason = function(route) {
    var reason;

    if (route === "") {
      reason = "empty string received";
    } else if (route === null) {
      reason = "null received";
    } else if (route === undefined) {
      reason = "undefined received";
    } else {
      reason = (route.constructor.name || route.toString()) + " received";
    }

    return reason;
  };

  Dispatcher.run = function(app, route) {
    var reason;

    if (!route || typeof(route) !== "string") {
      throw new Error("You have to provide the route like site#index; " + Dispatcher.errorReason(route));
    }

    new Dispatcher(app).run(route);
  };

  Dispatcher.compat = function() {
    var meta = $("head meta[name=page]");

    if (meta.length === 0) {
      throw new Error('No meta tag found. Use something like <meta name="page" content="controller#action" />');
    }

    Dispatcher.run(window.App, meta.attr("content"));
  };

  Dispatcher.turbolinks = function(app) {
    var runner = function() {
      Dispatcher.run(app, $("body").data("route"));
    };

    $(document).on("page:load", runner);
    $(document).ready(runner);
  };

  Dispatcher.prototype.run = function(route) {
    route = route.split("#");

    var controllerName = route[0];
    var actionName = route[1];
    var controller = this.getController(controllerName);
    var action = this.getAction(controller, actionName);

    this.invoke(this.app.before);
    this.invoke(controller.before);
    this.invoke(action);
    this.invoke(controller.after);
    this.invoke(this.app.after);
  };

  // Return the controller for the specified name.
  // Return an empty object otherwise.
  Dispatcher.prototype.getController = function(name) {
    return this.app[name] || {};
  };

  // Return a action function.
  // Considers the alias for some names.
  Dispatcher.prototype.getAction = function(controller, name) {
    var action = controller[name];
    var alias = Dispatcher.ALIASES[name];

    if (!action && controller[alias]) {
      action = controller[alias];
    }

    return action;
  };

  // Execute the specified callback when defined.
  Dispatcher.prototype.invoke = function(callback) {
    callback && callback();
  };

  // Expose the interface.
  return {
      run: Dispatcher.run
    , compat: Dispatcher.compat
    , turbolinks: Dispatcher.turbolinks
    , aliases: Dispatcher.ALIASES
  };
})();
