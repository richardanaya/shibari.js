var Shibari  = function(){

};

Shibari.converters = {};
Shibari.BINDING_DIRECTION_TWO_WAY = 0;
Shibari.BINDING_DIRECTION_ONE_WAY = 1;
Shibari.BIND_ATTRIBUTES_PREFIX = "bind-";

Shibari.addConverter = function(name,converter){
    Shibari.converters[name] = converter;
};

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

Shibari.parseBindingData = function(bindingDataString){
    if(bindingDataString.indexOf(':') != -1){
        var pairs = bindingDataString.split(',');
        var d = {};
        for(var i = 0 ; i < pairs.length; i++){
            var pr = pairs[i].split(":");
            d[pr[0]] = pr[1];
        }
        var bd = {
            path: d.path,
            converter: null,
            direction: Shibari.BINDING_DIRECTION_TWO_WAY
        }

        if(d.converter){
            bd.converter = d.converter;
        }
        if(d.direction){
            if(d.direction == "TwoWay"){
                bd.direction = Shibari.BINDING_DIRECTION_TWO_WAY;
            }
            else if(d.direction == "OneWay"){
                bd.direction = Shibari.BINDING_DIRECTION_ONE_WAY;
            }
        }
        return bd;
    }
    else {
        return {
            path: bindingDataString,
            converter: null,
            direction: Shibari.BINDING_DIRECTION_TWO_WAY
        }
    }
};

Shibari.evaluateToValue = function(context,bindingData){
    if(bindingData.converter!= null){
        var converter = Shibari.converters[bindingData.converter];
        return converter.to(context[bindingData.path]);
    }
    else {
        return context[bindingData.path];
    }
};

Shibari.evaluateFromValue = function(element,bindingData){
    if(bindingData.converter!= null){
        var converter = Shibari.converters[bindingData.converter];
        return converter.from(Shibari.getInputValue(element));
    }
    else {
        return Shibari.getInputValue(element);
    }
};

Shibari.bindContentToValue = function(el,attrName,context,bindingDataString){
    var bd = Shibari.parseBindingData(bindingDataString);
    Shibari.setHTML(el,Shibari.evaluateToValue(context,bd));
    Object.observe(context,function(c){
        Shibari.setHTML(el,Shibari.evaluateToValue(context,bd));
    });
};

Shibari.bindToValue = function(el,attrName,context,bindingDataString){
    var bd = Shibari.parseBindingData(bindingDataString);
    var preventCircular = false;

    //if we are binding to an input, we can do two way binding
    if(el.nodeName == "INPUT"){
        //if we are binding to value attribute, watch for input changes
        if(bd.direction == Shibari.BINDING_DIRECTION_TWO_WAY && attrName=="value"){
            Shibari.onChange(el,function(){
                if(!preventCircular){
                    preventCircular = true;
                    context[bd.path] = Shibari.evaluateFromValue(el,bd);
                }
                else {
                    preventCircular = false;
                }
            });
        }

        //set value for the first time, but make sure it doesn't change object
        preventCircular = true;
        Shibari.setAttribute(el,attrName,Shibari.evaluateToValue(context,bd));
        if(attrName=="value"){
            Shibari.triggerEvent(el,"change");
        }

        //watch for changes there on
        Object.observe(context,function(c){
            for(var i = 0; i < c.length; i++){
                if(c[i].name == bd.path){
                    if(!preventCircular){
                        preventCircular = true;
                        if(attrName=="value"){
                            Shibari.setInputValue(el,Shibari.evaluateToValue(context,bd));
                            Shibari.triggerEvent(el,"change")
                        }
                        else {
                            Shibari.setAttribute(el,attrName,Shibari.evaluateToValue(context,bd));
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
            for(var i = 0; i < c.length; i++){
                if(c[i].name == bd.path){
                    Shibari.setAttribute(el,attrName,Shibari.evaluateToValue(context,bd));
                }
            }
        });
    }
};