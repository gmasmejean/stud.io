/* 
 * Section router
 */

var section = function(manager){
    this.manager = manager;
    this.buildMgrStack();
};

section.prototype.buildMgrStack = function(){
    if( !this.manager.compiledRoutes.section )
        this.manager.compiledRoutes.section = [];
};
section.prototype.compile = function( routeObject, routeName ){    
    var subRouteManager = new (this.manager.constructor)(routeObject.childs);
    
    this.manager.compiledRoutes.section.push({rgx:new RegExp('\^'+routeObject.route+'(.*)\$' ),name:routeName,
        manager:subRouteManager,controller:routeObject.controller,action:routeObject.action});
};

section.prototype.match = function(route){
    for( var i=0; i<this.manager.compiledRoutes.section.length; i++){
        var m = route.match( this.manager.compiledRoutes.section[i].rgx );
        if( m ){
            if( !m[1]){
                var cr = this.manager.compiledRoutes.section[i];
                return {controller:cr.controller,action:cr.action,name:cr.name};
            }else
                return this.manager.compiledRoutes.section[i].manager.resolve(m[1]);
        }
    }
    return false;
};

section.prototype.url =function(routeName,params){
    if( this.manager.routes[routeName] && this.manager.routes[routeName].type==='section')
        return this.manager.routes[routeName].route;
    else{
        var url=false;
        for( var i=0; i<this.manager.compiledRoutes.section.length; i++ ){
            url = this.manager.compiledRoutes.section[i].manager.url(routeName,params);
            if( url )
                return this.manager.routes[this.manager.compiledRoutes.section[i].name].route+url;
        }
        return false;
    }
};

module.exports = section;