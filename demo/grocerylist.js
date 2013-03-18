$(document).ready(function () {

    //Bind our data structure
    var groceryList = {
        title: "Grocery List",
        items: []
    };

    //to our HTML
    Shibari.bind($('.grocery-list').get(0), groceryList);


    //And then just operate off the data structure ( nothing fancy yah? :) )
    function createNewItem() {
        var v = $('.input-new-item').val();
        if (v.trim() != "") {
            groceryList.items.push({name: $('.input-new-item').val(), id: Math.random()});
            $('.input-new-item').val('')
            $('.input-new-item').focus();
        }
    }

    function removeItem(id) {
        for (var i = 0; i < groceryList.items.length; i++) {
            if (groceryList.items[i].id == id) {
                groceryList.items.splice(i, 1);
                return;
            }
        }
    };

    $('.button-add-new').click(function () {
        createNewItem();
    });

    $('.input-new-item').keydown(function (e) {
        //if we hit enter
        if (e.keyCode == 13) {
            createNewItem();
        }
    });

    $('.grocery-list').mouseup(function (e) {
        //if we mouse up off a close button
        if ($(e.target).hasClass("item-close")) {
            removeItem($(e.target).attr("data-id"));
        }
    });

    //focus on input for instant typing
    $('.input-new-item').focus();
});