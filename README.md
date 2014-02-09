# Dispatcher

Dispatcher is a small JavaScript library that automatically calls your functions when page is loaded. It was primary written to be used by Rails applications, but it will work with any web page you have.

Dispatcher requires jQuery.

## Usage

### Installation through bower

If you're using Rails, you can create a `.bowerrc` file like the following:

```javascript
{
  "directory": "app/assets/components"
}
```

Then create a `bower.json` like this:

```javascript
{
  "name": "myapp",
  "version": "0.0.1",
  "private": true,
  "dependencies": {}
}
```

Install your dependency with `bower install dispatcher`.

```text
$ bower install dispatcher
bower dispatcher#*              cached git://github.com/fnando/dispatcher-js.git#0510770257
bower dispatcher#*            validate 0510770257 against git://github.com/fnando/dispatcher-js.git#*
bower dispatcher#*                 new version for git://github.com/fnando/dispatcher-js.git#*
bower dispatcher#*             resolve git://github.com/fnando/dispatcher-js.git#*
bower dispatcher#*            download https://github.com/fnando/dispatcher-js/archive/v0.1.0.tar.gz
bower dispatcher#*             extract archive.tar.gz
bower dispatcher#*            resolved git://github.com/fnando/dispatcher-js.git#0.1.0
bower dispatcher#~0.1.0        install dispatcher#0.1.0
```

### Using a custom app

Add the following lines to your `application.js`:

```javascript
//= require jquery
//= require dispatcher
```

To dispatch a given JavaScript for a page, you can use the `Dispatcher.run(app, route)` function.

The `app` object can be something like this:

```javascript
var app = {
  site: {
    index: function() {
      console.log("Welcome to the home page");
    }
  }
};
```

To manually trigger this route, just call the `Dispatcher.run` function like the following:

```javascript
Dispatcher.run(app, "site#index");
```

You'll probably do this when the document is ready.

```javascript
$(document).ready(function(){
  Dispatcher.run(app, "site#index");
});
```

The `route` string will be defined by your server-side app. In Rails, you can create a helper like the following:

```ruby
def dispatcher_route
  controller_name = controller_path.gsub(/\//, "_")
  "#{controller_name}##{action_name}"
end
```

Then you can output it in your `<body>`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body data-route="<%= dispatcher_route %>">

</body>
</html>
```

Finally, you can trigger the route with the following snippet:

```javascript
$(document).ready(function(){
  Dispatcher.run(app, $("body").data("route"));
});
```

Instead of doing this wrapper manually, you can call `Dispatcher.init`, which receives an application and binds to the document's `ready` and `page:load` events. There's no need to wrapper in a jQuery initialize, since this done internally.

```javascript
Dispatcher.init(app);
```

The latest release allows you to provide any object as your application. If you want the old behavior back, please read the "Using the compat mode" section.

## Callbacks

You can set functions to be execute before and after the actual route. For global callbacks, you can set the following attributes:

```javascript
var app = {
    before: function() {}
  , after: function() {}
};
```

You can also set these callbacks for each controller:

```javascript
var app = {
  site: {
      before: function() {}
    , after: function() {}
  }
};
```

### Using the compat mode

Add the following lines to your `application.js`:

```javascript
//= require jquery
//= require dispatcher
//= require dispatcher/compat
```

To bring the old behaviour back, add a meta tag called +page+. This tag should have the controller and action names like the following.

```html
<meta name="page" content="users#index" />
```

Rails developers can use the helpers below:

```ruby
def dispatcher_route
  controller_name = controller_path.gsub(/\//, "_")
  "#{controller_name}##{action_name}"
end

def dispatcher_tag
  tag(:meta, {name: "page", content: dispatcher_route}, true)
end
```

Your application must be defined as a global variable called +App+.

```javascript
App.users = {};

App.users["index"] = function() {
  // execute specific code for users/index
};

App.users["new"] = function() {
  // execute specific code for users/new
}
```

The same `before` and `after` callbacks are available here.

### Turbolinks

Dispatcher works with Turbolinks. You don't have to do anything special and, to be frank, the code is exactly the same. You just need to set up the `data-route` attribute in your `<body>` element.

```javascript
var MyApp = {
  site: {
    index: function() {
      console.log("Welcome to the home page");
    }
  }
};

Dispatcher.init(MyApp);
```

```html
<body data-route="<%= dispatcher_route %>"></body>
```

### Aliases

Some action names are aliased:

- `update` will map to `edit`.
- `create` will map to `new`.
- `destroy` will map to `remove`.

== License

(The MIT License)

Copyright © 2011-2014 Nando Vieira (http://nandovieira.com.br)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ‘Software’), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
