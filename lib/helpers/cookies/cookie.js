/**
 * Cookie object.
 */

var cookie = function( name, value, options){
    this.name = name;
    this.value = value;
    for( var opt in options )
        this[opt] = options[opt];
};

cookie.prototype = {
    path:undefined,
    domain:undefined,
    expires:undefined,
    secure:false,
    httponly:true
};

Object.defineProperty(cookie.prototype,'max-age',{
    set:function(seconds){ this.expires = new Date(Date.now()+seconds*1000).toUTCString(); }});

cookie.prototype.toString = function(){
    var str = this.name+'='+this.value;
    if( this.domain ) str +='; Domain='+this.domain;
    if( this.path ) str +='; Path='+this.path;
    if( this.expires ) str +='; Expires='+this.expires;
    if( this.secure ) str +='; Secure';
    if( this.httponly ) str +='; HttpOnly';
    return str;
};

module.exports = cookie;