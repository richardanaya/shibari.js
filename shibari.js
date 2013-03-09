var Shibari  = function(){

};

Shibari.BIND_ATTRIBUTES_PREFIX = "bind-";

Shibari.getAttribute = function(el,attr){
    return $(el).attr(attr);
};

Shibari.setAttribute = function(el,attr,value){
    $(el).attr(attr,value);
};

Shibari.getInputValue = function(el){
    return $(el).val();
};

Shibari.setInputValue = function(el,value){
    $(el).val(value);
};

Shibari.getChildren = function(el){
    return $(el).children();
};

Shibari.setHTML = function(el,html){
    $(el).html(html);
};

Shibari.onChange = function(el,callback){
    $(el).change(callback);
};

Shibari.triggerEvent = function(el,eventName){
    $(el).trigger(eventName);
};

Shibari.bind = function(el,context){
    if(!context){
        throw "Context does not exist";
    }
    el.shibariContext = context;
    var attributes = el.attributes;
    if(attributes){
        for(var i = 0; i < attributes.length; i++) {
            if(attributes[i].name == Shibari.BIND_ATTRIBUTES_PREFIX+"context"){
                //do nothing
            }
            else if(attributes[i].name == Shibari.BIND_ATTRIBUTES_PREFIX+"content"){
                Shibari.bindContentToValue(children[cel],attributes[i].name.substr(5),context,Shibari.getAttribute(children[cel],attributes[i].name));
            }
            else if(attributes[i].name.indexOf(Shibari.BIND_ATTRIBUTES_PREFIX) == 0) {
                Shibari.bindToValue(el,attributes[i].name.substr(5),context,Shibari.getAttribute(el,attributes[i].name));
            }
        }
    }
    Shibari.bindChildren(el,context);
};

Shibari.bindChildren = function(el,context){
    var children = Shibari.getChildren(el);
    for(var cel=0; cel<children.length;cel++){
        var attributes = children[cel].attributes;
        var nextContext = context;
        if(attributes){
            for(var i = 0; i < attributes.length; i++) {
                if(attributes[i].name == Shibari.BIND_ATTRIBUTES_PREFIX+"context"){
                    var con = context[Shibari.getAttribute(children[cel],attributes[i].name)];
                    if(con){
                        nextContext = con;
                    }
                    else {
                        throw "Context does not exist";
                    }
                }
                if(attributes[i].name == Shibari.BIND_ATTRIBUTES_PREFIX+"content"){
                    Shibari.bindContentToValue(children[cel],attributes[i].name.substr(5),context,Shibari.getAttribute(children[cel],attributes[i].name));
                }
                else if(attributes[i].name.indexOf(Shibari.BIND_ATTRIBUTES_PREFIX) == 0) {
                    Shibari.bindToValue(children[cel],attributes[i].name.substr(5),context,Shibari.getAttribute(children[cel],attributes[i].name));
                }
            }
        }
        //if we have a new context
        if(nextContext != context){
            if(Shibari.getChildren(children[cel]).length>0){
                Shibari.bind(children[cel],nextContext);
            }
        }
        //otherwise bind children with the existing context
        else {
            if(Shibari.getChildren(children[cel]).length>0){
                Shibari.bindChildren(children[cel],nextContext);
            }
        }
    }
};

Shibari.bindContentToValue = function(el,attrName,context,valueName){
    Shibari.setHTML(el,context[valueName]);
    Object.observe(context,function(c){
        Shibari.setHTML(el,context[valueName]);
    });
};

Shibari.bindToValue = function(el,attrName,context,valueName){
    var preventCircular = false;

    //if we are binding to an input, we can do two way binding
    if(el.nodeName == "INPUT"){
        //if we are binding to value attribute, watch for input changes
        if(attrName=="value"){
            Shibari.onChange(el,function(){
                if(!preventCircular){
                    preventCircular = true;
                    var val = Shibari.getInputValue(el);
                    context[valueName] = val;
                }
                else {
                    preventCircular = false;
                }
            });
        }

        //set value for the first time, but make sure it doesn't change object
        preventCircular = true;
        Shibari.setAttribute(el,attrName,context[valueName]);
        if(attrName=="value"){
            Shibari.triggerEvent(el,"change");
        }

        //watch for changes there on
        Object.observe(context,function(c){
            for(var i = 0; i < c.length; i++){
                if(c[i].name == valueName){
                    if(!preventCircular){
                        preventCircular = true;
                        if(attrName=="value"){
                            Shibari.setInputValue(el,context[valueName]);
                            Shibari.triggerEvent(el,"change")
                        }
                        else {
                            Shibari.setAttribute(el,attrName,context[valueName]);
                        }
                    }
                    else {
                        preventCircular = false;
                    }
                }
            }
        });
    }
    else {
        //if we are binding to anything other than an INPUT value, just make it a one way binding
        Object.observe(context,function(c){
            Shibari.setAttribute(el,attrName,context[valueName]);
        });
    }
};