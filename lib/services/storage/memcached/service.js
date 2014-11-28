/* Memcached storage client service */

var memcached = require('memcached');

var service = function( application ){
    this.app = application;
    
    var conf_servers = this.app.options.storages.memcached.servers;
    var servers = {};
    for(var i=0;i<conf_servers.length;i++){
        servers[conf_servers[i].host+':'+conf_servers[i].port] = conf_servers[i].weight;
    }
    
    this._memcached = new memcached( servers, this.app.options.storages.memcached.config );
};

service.prototype.touch = function(key,lifetime,callback){
    this._memcached.touch(key,lifetime,callback);
};

service.prototype.get = function(key,callback){
    this._memcached.get(key,callback);
};

service.prototype.gets = function(key,callback){
    this._memcached.gets(key,callback);
};

service.prototype.getMulti = function(keys,callback){
    this._memcached.getMulti(keys,callback);
};

service.prototype.set = function(key,value,lifetime,callback){
    this._memcached.set(key,value,lifetime,callback);
};

service.prototype.replace = function(key,value,lifetime,callback){
    this._memcached.replace(key,value,lifetime,callback);
};

service.prototype.add = function(key,value,lifetime,callback){
    this._memcached.add(key,value,lifetime,callback);
};

service.prototype.append = function(key,value,callback){
    this._memcached.append(key,value,callback);
};

service.prototype.prepend = function(key,value,callback){
    this._memcached.prepend(key,value,callback);
};

service.prototype.incr = function(key,amount,callback){
    this._memcached.incr(key,amount,callback);
};

service.prototype.decr = function(key,amount,callback){
    this._memcached.decr(key,amount,callback);
};

service.prototype.del = function(key,callback){
    this._memcached.del(key,callback);
};
        
module.exports = service;