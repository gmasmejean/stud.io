/**
 * Return a function to execute a given final function after executing in parallel all previously given functions.
 */

module.exports = function( fns ){    
    var l = fns.length,
        i = 0,
        done = 0,
        reference = { results:Array(l) },
        final = function( n ){
            
            done ++;            
            reference.results[n] = Array.prototype.slice.call(arguments,1);
            
            if( done===l && reference.callback )
                reference.callback( reference.results );
        };
    
    return function( callback ){
        reference.callback = callback;
        if( l ){
            for(;i<l;i++)
                fns[i][0].apply(fns[i][2]||null, (fns[i][1]||[]).concat(final.bind(null,i)) );
        }else
            callback();
    };
};

