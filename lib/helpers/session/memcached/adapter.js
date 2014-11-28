var error = require('../../../application/error');

var adapter = function(application){
    this.app = application;
    if( !this.app._memcachedstore )
        this.app._memcachedstore = this.app.serviceManager.get('memcached');
};

adapter.prototype.ERROR_INVALID_KEY = ['MEMCACHED_ADAPTER_INVALID_KEY','MCA_IK','This session does not exist.'];
adapter.prototype.ERROR_INVALID_DATAS = ['MEMCACHED_ADAPTER_INVALID_DATAS','MCA_ID','Datas is not an object.'];

adapter.prototype.exist = function( key, next ){
    this.app._memcachedstore.get(key,function(err,data){
        next( undefined, data?true:false );
    });
};

adapter.prototype.destroy = function( key, next ){
    this.app._memcachedstore.del(key,next);
};

adapter.prototype.set = function( key, datas, next ){
    if( typeof(datas)==='object'){
        this.app._memcachedstore.set(key,datas,this.app.options.storages.memcached.config.maxExpiration,next);
    }else
        next( error.new(this.ERROR_INVALID_DATAS.concat({datas:datas})) );
};

adapter.prototype.get = function( key, next ){
    this.app._memcachedstore.get(key,function(err,data){
        if( data ){
            next(undefined,data);
        }else
            next( error.new(this.ERROR_INVALID_KEY.concat({key:key})) );
    }.bind(this));
};

adapter.prototype.setValue = function( key, vname, value, next ){
    this.app._memcachedstore.get(key,function(err,data){
        if( !data )
            data = {};
        data[vname] = value;
        this.app._memcachedstore.set(key,data,this.app.options.storages.memcached.config.maxExpiration,next);
    }.bind(this));
};

adapter.prototype.getValue = function( key, vname, next ){
    this.get(key,function(err,data){
        next( undefined, data[vname] );
    }.bind(this));
};

module.exports = adapter;