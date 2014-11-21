/**
 * Helper manager. Create context helper.
 */

var error = require('../error');

var manager = function( application ){
    this.app = application;
    this.helpers = {};
};

manager.prototype.ERROR_ADD_NO_NAME = ['HELPER_MANAGER_ERROR','HMGR_AEN','Can\'t add helper with empty name'];
manager.prototype.ERROR_ADD_INVALID_PATH = ['HELPER_MANAGER_ERROR','HMGR_IP','Can\'t add helper, path is invalid'];
manager.prototype.ERROR_ADD_INVALID_HELPER = ['HELPER_MANAGER_ERROR','HMGR_IH','Can\'t add helper, helper must be a function or a file path.'];
manager.prototype.ERROR_NOT_EXIST = ['HELPER_MANAGER_ERROR','HMGR_NE','Helper does not exist.'];

manager.prototype.configure = function( helpers, path , next ){
    if( helpers instanceof Object ){        
        for( var name in helpers ){
            this.add(name, helpers[name], path );
        }
    }
    next();
};

manager.prototype.add = function( name, helper, path ){
    if( name ){
        if( typeof(helper) === 'string' ){
            try{
                this.helpers[name] = require(path+helper);
                return;
            }catch( e ){
                this.app.throw( error.new(this.ERROR_ADD_INVALID_PATH.concat({name:name,path:path+helper})) );
            }
        }
        else if( typeof(helper) === 'function' ){
            this.helpers[name] = helper;
            return;
        }
        this.app.throw( error.new(this.ERROR_ADD_INVALID_HELPER.concat({name:name,path:path,helper:''+helper})) );
    }
    this.app.throw( error.new(this.ERROR_ADD_NO_NAME.concat({path:path})) );    
};


manager.prototype.get = function( name, ctx){
    if( this.helpers[name] ){
        return new (this.helpers[name])( ctx );
    }else
        this.app.throw( error.new(this.ERROR_NOT_EXIST.concat({name:name})) );
};

manager.prototype.exist = function( name ){
    return this.helpers[name]?true:false;
};

module.exports = manager;