var error = require('../../../application/error');

var adapter = function(application){
    this.app = application;
    if( !this.app._memorystore )
        this.app._memorystore = {};
};

adapter.prototype.ERROR_INVALID_KEY = ['MEMORY_ADAPTER_INVALID_KEY','MA_IK','This session does not exist.'];

adapter.prototype.exist = function( key, next ){
    next( undefined, this.app._memorystore[key]?true:false );
};

adapter.prototype.destroy = function( key, next ){
    delete(this.app._memorystore[key]);
    next();
};

adapter.prototype.set = function( key, datas, next ){
    this.app._memorystore[key] = datas;
    next();
};

adapter.prototype.get = function( key, next ){
    if( this.app._memorystore[key] )
        next( undefined, this.app._memorystore[key] );
    else
        next( error.new(this.ERROR_INVALID_KEY.concat({key:key})) );
};

adapter.prototype.setValue = function( key, vname, value, next ){
    if( !this.app._memorystore[key] )
        this.app._memorystore[key] = {};
    
    this.app._memorystore[key][vname] = value;
    next();
};

adapter.prototype.getValue = function( key, vname, next ){
    if( this.app._memorystore[key] )
        next (undefined, this.app._memorystore[key][vname] );
    else
        next( error.new(this.ERROR_INVALID_KEY.concat({key:key})) );
};

module.exports = adapter;