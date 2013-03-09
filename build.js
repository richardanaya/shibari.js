var buildify = require('buildify');

buildify()
    .concat(['observe.polyfill.js', 'shibari.js'])
    .uglify()
    .save('shibari.min.js');