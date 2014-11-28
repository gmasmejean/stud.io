/* Redis storage client service */

var redis = require('redis');

var service = function( application ){
    this.app = application;
    
    this._redis = redis.createClient();
};

service.prototype.get = function(key,callback){
    this._redis.get(key,callback);
};

service.prototype.set = function(key,value,callback){
    this._redis.set(key,value,callback);
};

service.prototype.hmset = function(key,datas,callback){
    this._redis.hmset(key,datas,callback);
};

service.prototype.hgetall = function(key,callback){
    this._redis.hgetall(key,callback);
};

service.prototype.hset = function(key,field,value,callback){
    this._redis.hset(key,field,value,callback);
};

service.prototype.hget = function(key,field,callback){
    this._redis.hget(key,field,callback);
};

service.prototype.hlen = function(key,callback){
    this._redis.hlen(key,callback);
};

service.prototype.del = function(key,callback){
    this._redis.del(key,callback);
};

module.exports = service;