$(document).ready(function(){
    var a = {
        fname: "Richard",
        lname: "Anaya",
        age: 30,
        projects: {
            url: "http://github.com/richardanaya"
        }
    };

    Shibari.bind($('#component0').get(0),a);
    /*setInterval(function(){
        a.age = Math.floor(100*Math.random());
    },10000)*/
});