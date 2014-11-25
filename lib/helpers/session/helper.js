var adapter = require('./memory/adapter');
var crypto = require('crypto');
var error = require('../../application/error');

var helper = function( context ){
    if( context._helpers.session )
        return context._helpers.session;

    this.ctx = context;
    this.cookies_helper = this.ctx.getHelper('cookies');
    
    this.id = this.cookies_helper.get(this.cookiename);
    if( !this.id ){
        this.id = crypto.createHash('sha1').update(Date.now()+this.ctx.requestIp()).digest('hex');
        this.cookies_helper.set(this.session_name,this.id,{httponly:true});
    }

    this.store_adapter = (this.ctx.app.options['session'] && this.ctx.app.options['session']['adapter'])?require(this.ctx.app.options['session']['adapter']):adapter;
    this.store = new this.store_adapter(this.ctx.app);

    context._helpers.session = this;
};

helper.prototype.session_name = 'njs_sessid';
helper.prototype.ERROR_INVALID_VALUES = ['SESSION_HELPER_INVALID_VALUES','SH_IVS','Values is invalid.'];
helper.prototype.ERROR_INVALID_VALUE = ['SESSION_HELPER_INVALID_VALUE','SH_IV','Value is invalid.'];
helper.prototype.ERROR_INVALID_NAME = ['SESSION_HELPER_INVALID_NAME','SH_IN','Name is invalid.'];

helper.prototype.get = function(next){
    this.store.get(this.id,next);
};
helper.prototype.set = function(values,next){
    if( !values || typeof(values)!=='object' )
        next( error.new(this.ERROR_INVALID_VALUES.concat({values:values})) );
    else
        this.store.set(this.id,values,next);
};
helper.prototype.getValue = function(name,next){
    if( typeof(name) === 'string' && name!=='' )
        this.store.getValue(this.id,name,next);
    else
        next( error.new(this.ERROR_INVALID_NAME.concat({name:name})) );
};
helper.prototype.setValue = function(name,value,next){
    if( !value || (typeof(value)!=='string' && typeof(value)!=='number') )
        next( error.new(this.ERROR_INVALID_VALUE.concat({value:value})) );
    else if( typeof(name) !== 'string' && name!=='' )
        next( error.new(this.ERROR_INVALID_NAME.concat({name:name})) );
    else
        this.store.setValue(this.id,name,value,next);
};
helper.prototype.exist = function(next){
    this.store.exist(this.id,next);
};
helper.prototype.destroy = function(next){
    this.store.destroy(this.id,next);
};

module.exports = helper;