/**
 * Cookies manager service.
 */

var service = function( application ){
    this.app = application;
};














var service = function( context ){
    if( context._cookies )
        return context._cookies;
    else{
        this.added = {};
        this.context = context;
        context._cookies = this;
    }
};

cookies.prototype.cookie = cookie;

cookies.prototype.getRequestCookies = function(){
    if( this.context.request.headers.cookie.length ){
        var buffer = this.context.request.headers.cookie.replace( new RegExp(';|=') );
        if( buffer.length>1 ){
            this.currents={};
            for( var i=0; i<buffer.length; i+=2 )
                this.currents[buffer[i]]= new cookie(buffer[i],buffer[i+1]);               
        }
    }
};

// Get a cookie by its name.
cookies.prototype.get = function( name ){
    if( !this.currents )
        this.getRequestCookies();
    return this.currents[name];
};

// Set a cookie. 
// Params can be: instance of cookie or 3 following parameters: name,value,options
cookies.prototype.set = function(){
    if( arguments[0] instanceof cookie )
        this.added[arguments[0].name]=arguments[0];
    else
        this.added[arguments[0]] = new cookie(arguments[0],arguments[1],arguments[2]);
};

cookies.prototype.remove = function(name){
    if(!this.currents)
        this.getRequestCookies();
    if(this.added[name])
        delete(this.added[name]);
    if(this.currents[name])
        this.added[name] = new cookie(name,'',{expires: new Date(Date.now()-3600).toUTCString() });
};

cookies.prototype.setHeaders = function(){
    var self = this;
    this.context.response.setHeader('Set-Cookie',Object.keys(this.added).map(function(){ return self[this].toString(); }));
    
};


