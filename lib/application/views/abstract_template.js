/**
 * Abstract template model.
 */

var template = function(context,datas){
    this.ctx = context;
    this.datas = datas;
    this.childs = {};
};

template.prototype.addChild =function(name, child){
    if( child instanceof template )
        this.childs[name] = child;
};

// Used in template to add sub template.
template.prototype.child = function(name,datas){
    return this.childs[name]?this.childs[name].render(datas):'';
};

// Render sub template.
template.prototype.partial = function( name, datas ){
    return (this.ctx.getView( name, datas)).render();
};

// Must be overrided by template builder.
template.prototype.render = function(){};

module.exports = template;
