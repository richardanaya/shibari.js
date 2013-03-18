var buildify = require('buildify');

buildify()
    .concat([
        'underscore.observable.js',
        'observe.polyfill.js',
        'shibari.js'])
    .uglify()
    .save('shibari.min.js');