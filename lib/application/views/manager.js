/*
 * Views manager.
 * Load & manage app views.
 */

var util = require('../../utilities/utilities.js'),
    engine = require('./engine.js'),
    error = require('../error.js');

var manager = function( application ){
    this.app = application;
    this.views = {};        
};

manager.prototype.ERROR_INVALID_ENGINE_PATH = ['VMGR_INVALID_ENGINE_PATH','VMGR_IEP','Path not found'];

manager.prototype.configure = function( views, path , next ){    
    if( !this.engine )
        this.setEngine();
    
    var fns = [];
    if( views instanceof Object ){
        for( var name in views ){
            if( views[name] instanceof Object ){
                fns.push([this.add.bind(this),[name,views[name],path]]);
            }
        }
    }
    util.parallel(fns)(next);
};

manager.prototype.add = function( name, view, path, next){
    if( name && typeof(name)==='string' && view && typeof(view)==='string' ){
        
        
        
        
    
    }
};

manager.prototype.get = function( name, context, datas ){
    if( this.views[name] )
        return new (this.views[name])(context,datas);
};

manager.prototype.remove = function( name ){
    this.views[name] = undefined;
};

manager.prototype.exist = function( name ){
    return this.views[name]?true:false;
};

manager.prototype.setEngine = function(){
    if( this.app.options['viewmanager'] && this.app.options['viewmanager']['engine'] ){
        try{
            engine = require(this.app.__DIR__+this.app.options['viewmanager']['engine']);
        }catch( e ){
            this.app.throw( error.new(this.ERROR_INVALID_ENGINE_PATH.concat({path:this.app.options['viewmanager']['engine']})) );
        }
    }
    this.engine = new engine( this );
};

module.exports = manager;