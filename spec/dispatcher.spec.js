describe("dispatcher.js", function() {
  var app;
  var callback;

  beforeEach(function() {
    callback = jasmine.createSpy();
    app = {};
  });

  afterEach(function() {
    $("meta[name=page]").remove();
  });

  it("raises exception without a route", function() {
    expect(function(){
      Dispatcher.run();
    }).toThrow();
  });

  it("triggers global before callback", function() {
    app.before = callback;
    Dispatcher.run(app, "site#index");

    expect(callback).toHaveBeenCalled();
  });

  it("triggers global after callback", function() {
    app.after = callback;
    Dispatcher.run(app, "site#index");

    expect(callback).toHaveBeenCalled();
  });

  it("doesn't raise when has no global before callback", function() {
    expect(function(){
      Dispatcher.run(app, "site#index");
    }).not.toThrow();
  });

  it("triggers controller's before callback", function() {
    app.site = {before: callback};
    Dispatcher.run(app, "site#index");

    expect(callback).toHaveBeenCalled();
  });

  it("triggers controller's after callback", function() {
    app.site = {after: callback};
    Dispatcher.run(app, "site#index");

    expect(callback).toHaveBeenCalled();
  });

  it("triggers alias action - update", function() {
    app.users = {edit: callback};
    Dispatcher.run(app, "users#update");

    expect(callback).toHaveBeenCalled();
  });

  it("triggers alias action - create", function() {
    app.users = {new: callback};
    Dispatcher.run(app, "users#create");

    expect(callback).toHaveBeenCalled();
  });

  it("triggers alias action - remove", function() {
    app.users = {remove: callback};
    Dispatcher.run(app, "users#destroy");

    expect(callback).toHaveBeenCalled();
  });

  it("prefers named action instead of alias", function() {
    app.users = {new: jasmine.createSpy(), create: callback};
    Dispatcher.run(app, "users#create");

    expect(callback).toHaveBeenCalled();
    expect(app.users["new"]).not.toHaveBeenCalled();
  });

  it("triggers action", function() {
    app.site = {index: callback};
    Dispatcher.run(app, "site#index");

    expect(callback).toHaveBeenCalled();
  });

  it("raises exception when have no meta tag in compat mode", function() {
    expect(function(){
      Dispatcher.compat();
    }).toThrow();
  });

  it("triggers route for compat mode", function() {
    app.site = {index: callback};
    window.App = app;
    $("head").append("<meta name='page' content='site#index'>");

    Dispatcher.compat();

    expect(callback).toHaveBeenCalled();
  });

  it("listens turbolinks' event", function() {
    app.site = {index: callback};
    $("body").attr("data-route", "site#index");
    Dispatcher.turbolinks(app);

    $(document).trigger("page:load");

    expect(callback).toHaveBeenCalled();
  });

  it("listens document's ready event", function(next) {
    $("head").append("<meta name='page' content='site#index'>");
    app.site = {index: callback};
    window.App = app;

    $.getScript("../compat.js", function(){
      $(document).trigger("load");

      expect(callback).toHaveBeenCalled();
      next();
    });
  });
});
