Shibari.js
===

Shibari.js is a minimalistic library for binding of objects to HTML UI.

Project Status: Alpha

Current Features:
* Two-way binding on inputs
* Dynamic Array-binding
* Converters
* Subcontexts
* Binding modes

Planned Features:
* Unbinding
* Validators
* Remove/contain jquery dependency
* Remove/contain underscore dependency

Download:
----

Compressed: [download](https://raw.github.com/richardanaya/Shibari.js/master/shibari.min.js)

Important Notes:
---
* This library makes use of Object.observe or a polyfill if not present
* Currently the only two-way bindings occur with input values
* Currently depends on jquery and underscore ( make sure you include them wherever you put shibari.min.js ).

Example Usage:
----
```HTML
<div id="component">
    <input type="text" data-bind-value="fname">
    <input type="text" data-bind-value="lname">
    <a data-bind-content="url"></a>
</div>
```

```Javascript
var person = {
    fname: "Richard",
    lname: "Anaya",
    url: "http://github.com/richardanaya"
};

Shibari.bind(document.getElementById('component'),person);
```

Example Converter:
----
```HTML
<div id="component">
   <input type="text" data-bind-value="name">
   <input type="text" data-bind-value="path:price,converter:money">
</div>
```

```Javascript
var item = {
   name: "Beer",
   price: 2.5
};

Shibari.addConverter("money",
{
   to: function(value){ return "$"+value; },
   from: function(value){ return parseFloat(value.substring(1)); }
});

Shibari.bind(document.getElementById('component'),item);
```

Example Template:
----
```HTML
<div id="component" data-bind-template="developers">
    <div class="developer">
        <span data-bind-content="lastname"></span>, <span data-bind-content="firstname"></span>
    </div>
</div>
```

```Javascript
var roster = {
    developers : [
        {firstname:"Howard",lastname:"Smith"},
        {firstname:"Jason",lastname:"Dunn"},
        {firstname:"Jack",lastname:"Standard"},
        {firstname:"Richard",lastname:"Anaya"}
    ]
};

Shibari.bind(document.getElementById('component'),roster);

//do whatever operations you want on the array itself
roster.developers.sort(function(a,b){
    if(a.lastname<b.lastname) return -1;
    if(a.lastname>b.lastname) return 1;
    return 0;
})
```

Example: Grocery List:
----

You can view a more complex example of using shibari.js at the [grocery list demo](http://richardanaya.github.com/shibari.js/demo/grocerylist.html).

How to build:
---

```BASH
npm install buildify
node build.js
```
