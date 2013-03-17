Shibari.js
===

Shibari.js is a minimalistic library for binding of objects to HTML UI.

Project Status: Alpha

Current Features:
* Two-way binding on inputs
* One-way binding on any attribute
* Subcontexts
* Converters
* Binding modes
* One-way element content binding

Planned Features:
* Array-binding
* Unbinding
* Validators
* Remove jquery dependency

Download:
----

Compressed Minified: [download](https://raw.github.com/richardanaya/Shibari.js/master/shibari.min.js)

Example Usage:
----
```HTML
<div id="component0">
    <input type="text" data-bind-value="fname">
    <input type="text" data-bind-value="lname">
    <input type="number" data-bind-value="age">
    Projects
    <div data-bind-context="projects">
        URL: <a data-bind-content="url"></a>
    </div>
</div>
```

```Javascript
var person = {
    fname: "Richard",
    lname: "Anaya",
    age: 30,
    projects: {
        url: "http://github.com/richardanaya"
    }
};

Shibari.bind(document.getElementById('component0'),person);
```

Important Notes:
---
* This library makes use of Object.observe or a polyfill if not present
* Currently the only two-way bindings occur with input values
* Currently depends on jquery

How to build:
---

```BASH
npm install buildify
node build.js
```
