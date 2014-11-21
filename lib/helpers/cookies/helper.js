/**
 * Context cookies helper
 */

var helper = function( context ){
    if( context._helpers.cookies )
        return context._helpers.cookies;
    else{
        this.added = {};
        this.currents = {};
        this.ctx = context;
        context._helpers.cookies = this;
    }
};

helper.prototype.cookie = require('./cookie.js');

helper.prototype.getRequestCookies = function(){
    if( this.ctx.request.headers.cookie.length ){
        var buffer = this.ctx.request.headers.cookie.replace( new RegExp(';|=') );
        if( buffer.length>1 ){
            this.currents={};
            for( var i=0; i<buffer.length; i+=2 )
                this.currents[buffer[i]]= new this.cookie(buffer[i],buffer[i+1]);               
        }
    }
};

// Get a cookie by its name.
helper.prototype.get = function( name ){
    if( !this.currents )
        this.getRequestCookies();
    return this.currents[name]||undefined;
};

// Set a cookie. 
// Params can be: instance of cookie or 3 following parameters: name,value,options
helper.prototype.set = function(){
    if( arguments[0] instanceof this.cookie )
        this.added[arguments[0].name]=arguments[0];
    else
        this.added[arguments[0]] = new this.cookie(arguments[0],arguments[1],arguments[2]);
};

helper.prototype.remove = function(name){
    if(!this.currents)
        this.getRequestCookies();
    if(this.added[name])
        delete(this.added[name]);
    if(this.currents[name])
        this.added[name] = new this.cookie(name,'',{expires: new Date(Date.now()-3600).toUTCString() });
};

helper.prototype.setHeaders = function(){
    var self = this;
    this.ctx.response.setHeader('Set-Cookie',Object.keys(this.added).map(function(){ return self[this].toString(); }));
    
};

module.exports = helper;