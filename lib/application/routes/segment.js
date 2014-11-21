/* 
 * Segment router
 */

var segment = function(manager){
    this.manager = manager;
    this.buildMgrStack();
};

segment.prototype.buildMgrStack = function(){
    if( !this.manager.compiledRoutes.segment )
        this.manager.compiledRoutes.segment = [];
};
segment.prototype.compile = function( routeObject, routeName ){    
    var rgxStr = routeObject.route;
    var params = routeObject.route.match( new RegExp('\\[:\\w*\\]','g') )||[];
    var p, args=[];
    
    for( var i=0; i<params.length; i++){
        p = params[i].slice(2,-1);
        args.push(p);
        if( routeObject.constraints && routeObject.constraints[p] )
            rgxStr=rgxStr.replace( params[i],'\('+routeObject.constraints[p]+'\)');
        else
            rgxStr=rgxStr.replace( params[i],'\(.*\)');
    }
    ///!\ Regex may not works 'correctly': User have to escape regex special characters.
    this.manager.compiledRoutes.segment.push({rgx:new RegExp('\^'+rgxStr+'\$'),name:routeName,
        params:args,controller:routeObject.controller,action:routeObject.action});
};

segment.prototype.match = function(route){
    for( var i=0; i<this.manager.compiledRoutes.segment.length; i++){
        var m = route.match( this.manager.compiledRoutes.segment[i].rgx );
        if( m ){
            // Route is matching
            var cr = this.manager.compiledRoutes.segment[i],
                rObject = {controller:cr.controller,name:cr.name,action:cr.action,params:{}};
        
            for( var j=0; j<cr.params.length;j++)
                rObject.params[cr.params[j]] = m[j+1];            
            return rObject;
        }
    }
    return false;
};

segment.prototype.url =function(routeName,params){
    if( this.manager.routes[routeName] && this.manager.routes[routeName].type==='segment'){
        var url = this.manager.routes[routeName].route;
        for( var param in params )
            url = url.replace('[:'+param+']',params[param]);
        return url;
    }
    else return false;
};

module.exports = segment;