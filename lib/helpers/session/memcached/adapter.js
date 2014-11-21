var error = require('../../../application/error.js');
var memcached = require('memcached');

var adapter = function(application){
    this.app = application;
    if( !this.app._memcachestore )
        this.app._memcachestore = new memcached();
    this.app._memcachestore.set('toto', 'je suis en cache', 10, function(err,datas){
        console.log(err,datas);
    });
    this.app._memcachestore.get('toto', function(err,datas){
        console.log(err,datas);
    });
};

adapter.prototype.ERROR_INVALID_KEY = ['MEMCACHED_ADAPTER_INVALID_KEY','MCA_IK','This session does not exist.'];
adapter.prototype.ERROR_INVALID_DATAS = ['MEMCACHED_ADAPTER_INVALID_DATAS','MCA_ID','Datas is not an object.'];


/*adapter.prototype.exist = function( key, next ){
    next( undefined, this.app._memorystore[key]?true:false );
};

adapter.prototype.destroy = function( key, next ){
    delete(this.app._memorystore[key]);
    next();
};

adapter.prototype.set = function( key, datas, next ){
    if( typeof(datas)==='object'){
        this.app._memorystore[key] = datas;
        next();
    }else
        next( error.new(this.ERROR_INVALID_DATAS.concat({datas:datas})) );
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
};*/

module.exports = adapter;