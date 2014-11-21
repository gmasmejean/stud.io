/**
 * Utility returning a function to execute callback given after executing all previously given functions sequencially.
 */

module.exports = function( fns ){    
    var l = fns.length-1, 
        reference = {},    
        f = undefined;

    f = (function(fn, args, ctx ){
        return function(){
            fn.apply(ctx||null,(args||[]).concat( Array.prototype.slice.call(arguments,0) , reference.callback ) );
        };
    })(fns[l][0],fns[l][1],fns[l][2]);

    l--;
    for(;l>=0;l--){
        f = (function( fn, args, ctx, callback ){
            return function(){
                fn.apply(ctx||null,(args||[]).concat( Array.prototype.slice.call(arguments,0) , callback ) );
            };
        })( fns[l][0],fns[l][1],fns[l][2], f );
    }
    
    return function( callback ){
        reference.callback = callback;
        f();
    };
};