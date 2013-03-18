$(document).ready(function(){
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
});