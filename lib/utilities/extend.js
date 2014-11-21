/**
 * Extend first parameter object recursively with all properties from other object parameter 
 * Params: objectA, objectB, ...
 * @returns object
 */

var extend =  function(){
    var r = arguments[0]||{}, l = arguments.length, i=1;    
    if( l>1 ){
        for(;i<l;i++){
            for( var k in arguments[i] ){
                if( arguments[i][k] instanceof Object && r[k] ){
                     extend( r[k], arguments[i][k] );
                }else
                    r[k] = arguments[i][k];
            }
        }
    }
    return r;
};

module.exports = extend;