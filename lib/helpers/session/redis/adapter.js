var error = require('../../../application/error');

var adapter = function(application){
    this.app = application;
    if( !this.app._redisstore )
        this.app._redisstore = this.app.serviceManager.get('redis');
};

adapter.prototype.ERROR_INVALID_KEY = ['REDIS_ADAPTER_INVALID_KEY','RA_IK','This session does not exist.'];

adapter.prototype.exist = function( key, next ){
    this.app._redisstore.hlen(key,function(err,data){
        next( undefined, data?true:false );
    });
};

adapter.prototype.destroy = function( key, next ){
    this.app._redisstore.del(key,next);
};

adapter.prototype.set = function( key, datas, next ){
    this.app._redisstore.hmset(key,datas,next);
};

adapter.prototype.get = function( key, next ){
    this.app._redisstore.hgetall(key,function(err,data){
        if( data ){
            next(undefined,data);
        }else
            next( error.new(this.ERROR_INVALID_KEY.concat({key:key})) );
    }.bind(this));
};

adapter.prototype.setValue = function( key, vname, value, next ){
    this.app._redisstore.hset(key,vname,value,next);
};

adapter.prototype.getValue = function( key, vname, next ){
    this.app._redisstore.hget(key,vname,next);
};

module.exports = adapter;