/*
 * Context of request execution.
 */

var context = function(application, request, response){
    this.app = application;
    this.request = request;
    this.response = response;
    
    this._helpers = {};
    this._params = {};
    this._response = '';
};

context.prototype.setParams = function(params){
    this._params = params;
    return this;
};

context.prototype.getParam = function(name){
    return this._params[name];
};

context.prototype.requestIp = function(){
    return (this.request.headers['x-forwarded-for'] || '').split(',')[0] 
        || this.request.connection.remoteAddress;
};

context.prototype.setResponse = function( content ){
    this._response = content;
};

context.prototype.getHelper = function( name ){
    return this.app.helperManager.get( name, this);
};

context.prototype.getView = function( name, datas){
    return this.app.viewManager.get( name, this, datas);
};

module.exports = context;


