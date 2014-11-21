/* 
 * Literal router.
 */

var literal = function(manager){
    this.manager = manager;
    this.buildMgrStack();
};

literal.prototype.buildMgrStack = function(){
    if( !this.manager.compiledRoutes.literal )
        this.manager.compiledRoutes.literal = {};
};
literal.prototype.compile = function( routeObject, routeName ){    
    this.manager.compiledRoutes.literal[routeObject.route] = {
        name:routeName,controller:routeObject.controller,action:routeObject.action};
};

literal.prototype.match = function(route){
    // Route is matching
    if( this.manager.compiledRoutes.literal[route] )
        return this.manager.compiledRoutes.literal[route];
    else
        return false;
};

literal.prototype.url = function(routeName){
    if( this.manager.routes[routeName] && this.manager.routes[routeName].type==='literal')
        return this.manager.routes[routeName].route;
    else return false;
};

module.exports = literal;