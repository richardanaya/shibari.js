$(document).ready(function(){
    var a = {
        fname: "Richard",
        lname: "Anaya",
        age: 30,
        costOfBeer: 2.5,
        projects: {
            url: "http://github.com/richardanaya"
        }
    };

    var b = {
        books:  [
            {name:"Catcher and the Rye", price: 10},
            {name:"Calvin and Hobbes", price: 15},
        ]
    };

    Shibari.addConverter("price",
        {
            to: function(value){
                return "$"+value;
            },
            from: function(value){
                var n = value.substring(1);
                if(n.indexOf(".")!=-1){
                    return parseFloat(n);
                }
                else {
                    return parseInt(n);
                }
            }
        }
    );

    Shibari.bind($('#component0').get(0),a);
    Shibari.bind($('#component1').get(0),b);

    setInterval(function(){
        b.books[0].price += Math.random();
    },1000)
});