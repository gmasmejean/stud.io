/**
 * Services manager.
 * Load Services.
 */

var error = require('../error');
var manager = function( application ){
        this.app = application;
        this.services = {};
};

manager.prototype.ERROR_ADD_NO_NAME = ['SERVICE_MANAGER_ERROR','SMGR_AEN','Can\'t add service with empty name'];
manager.prototype.ERROR_ADD_INVALID_PATH = ['SERVICE_MANAGER_ERROR','SMGR_AIP','Can\'t add service, path is invalid'];
manager.prototype.ERROR_ADD_INVALID_SERVICE = ['SERVICE_MANAGER_ERROR','SMGR_AIS','Can\'t add service, service must be a function or a file path.'];
manager.prototype.ERROR_NOT_EXIST = ['SERVICE_MANAGER_ERROR','SMGR_NE','Service does not exist.'];

manager.prototype.configure = function( services, path , next ){
    if( services instanceof Object ){        
        for( var name in services ){
            if( services[name] instanceof Object ){                
                var uniq = services[name].unique!==undefined?services[name].unique:false;                
                this.add(name,services[name].service,uniq,path);
            }
        }
    }
    next();
};

manager.prototype.add = function( name, service, unique, path){  
    if( name ){
        if( typeof(service) === 'string' ){
            try{
                this.services[name] = {unique:unique, service:require(path+service)};
                return;
            }catch( e ){
                this.app.throw( this.ERROR_ADD_INVALID_PATH, {name:name,path:path});
            }
        }
        else if( typeof(service) === 'function' ){
            this.services[name] = {unique:unique, service:service};
            return;
        }
        this.app.throw( this.ERROR_ADD_INVALID_SERVICE,{name:name,path:path});
    }
    this.app.throw( this.ERROR_ADD_NO_NAME,{path:path});
};

manager.prototype.get = function( name ){
    if( this.services[name] ){
        if( this.services[name].unique ){
            if( !this.services[name].instance )
                this.services[name].instance = new this.services[name].service( this.app );
            
            return this.services[name].instance;
        }else
            return new this.services[name].service( this.app );
    }else
        this.app.throw( this.ERROR_NOT_EXIST, {name:name});
};

manager.prototype.remove = function( name ){
    this.services[name] = undefined;
};

manager.prototype.exist = function( name ){
    return this.services[name]?true:false;
};

module.exports = manager;