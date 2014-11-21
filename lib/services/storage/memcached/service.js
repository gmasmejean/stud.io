/* Memcached storage client service */

var memcached = require('memcached');

var service = function( application ){
    this.app = application;
    this._memcached = new memcached();
};

service.prototype.get = function(key,callback){
    this._memcached.get(key,callback);
};

service.prototype.set = function(key,value,lifetime,callback){
    this._memcached.set(key,value,lifetime,callback);
};
        
module.exports = service;