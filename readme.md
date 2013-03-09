Shibari.js
===

Shibari.js is a minimalistic library for binding of objects to HTML UI.

Planned Features:
* Converters
* Validators
* Binding modes
* Remove jquery dependency

Download:
----

Compressed Minified: [download](https://raw.github.com/richardanaya/Shibari.js/master/shibari.min.js)

Example Usage:
----
```HTML
<div id="component0">
    <input type="text" bind-value="fname">
    <input type="text" bind-value="lname">
    <input type="number" bind-value="age">
    Projects
    <div bind-context="projects">
        URL: <a bind-content="url"></a>
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

Shibari.bind($('#component0').get(0),person);
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