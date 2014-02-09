# Dispatcher

Dispatcher is a small JavaScript library that automatically calls your functions when page is loaded. It was primary written to be used by Rails applications, but it will work with any web page you have.

Dispatcher requires jQuery.

## Usage

### Custom app

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

To trigger this info, you'll need to pass the route like the following:

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
  controller_name = controller.class.name
    .underscore
    .gsub(/\//, "_")
    .gsub!(/_controller$/, "")

  "#{controller_name}##{controller.action_name}"
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

The latest release allows you to provide any object as your application. If you want the old behavior back, please read the "Compat mode" section.

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

### Compat mode

To bring the old behaviour back, add a meta tag called +page+. This tag should have the controller and action names like the following.

```html
<meta name="page" content="users#index" />
```

Rails developers can use the helpers below:

```ruby
def dispatcher_route
  controller_name = controller.class.name
    .underscore
    .gsub(/\//, "_")
    .gsub!(/_controller$/, "")

  "#{controller_name}##{controller.action_name}"
end

def dispatcher_tag
  tag(:meta, {name: "page", content: dispatcher_route}, true)
end
```

Then you need to include `dispatcher.js` and `dispatcher-compat.js`

```html
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="dispatcher.js"></script>
<script type="text/javascript" src="lib.js"></script>
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

You can also use Dispatcher with Turbolinks. Just provide an app to the `Dispatcher.turbolinks` function.

```javascript
var MyApp = {
  site: {
    index: function() {
      console.log("Welcome to the home page");
    }
  }
};

Dispatcher.turbolinks(MyApp);
```

This will require a route defined in the `<body>` element:

```html
<body data-route="<%= dispatcher_route %>">
</body>
```

== License

(The MIT License)

Copyright © 2011-2014 Nando Vieira (http://nandovieira.com.br)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ‘Software’), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
