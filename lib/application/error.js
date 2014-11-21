/**
 * Overriding default error object
 * @param {string} name: Error name
 * @param {string} code: Error code
 * @param {string} message: Error message
 * @param {object} datas: Error usefull datas object
 * @returns {Error}
 */
var error = function( name, code, message, datas ){
    this.name = name||'Error';
    this.code = code;
    this.message = message;
    this.datas = datas;
    Error.captureStackTrace(this,error);
    return this;
};

error.prototype = new Error();
error.prototype.constructor = error;

error.new = function(){
    return error.apply(Object.create(error.prototype),arguments[0]);
};

module.exports = error;