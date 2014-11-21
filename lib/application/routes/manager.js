/* 
 * Route Manager.
 * Build routes configuration / Route request.
 * 
 * Routes configuration example:
 * var routes = {
 *      nameRouteA:{
 *          type:'literal',
 *          route:'literal/path',
 *          controller:'nameOfCalledModule',
 *          action:'moduleActionToCall'
 *      },
 *      nameRouteB:{
 *          type:'segment',
 *          route:'segment/[:dynamicParam]/path',
 *          controller:'nameOfCalledModule',
 *          action:'moduleActionToCall',
 *          constraints:{
 *              dynamicParam:'\\w\*' // Have to match with given Regex.
 *          }
 *      },
 *      nameRouteC:{
 *          type:'section',
 *          route:'section/common/',
 *          controller:'nameOfCalledModule',
 *          action:'moduleActionToCall',
 *          childs:{
 *              nameChildRoute:{
 *                  type:'literal',
 *                  route:'add',
 *                  controller:'nameOfCalledModule',
 *                  action:'moduleActionToCall'
 *              },
 *              nameChildRouteB:{
 *                  type:'segment',
 *                  route:'get/[:element]',
 *                  controller:'nameOfCalledModule',
 *                  action:'moduleActionToCall'
 *              },
 *          }
 *      }
 *  }
 */

var defaultrouters = {
        literal: require('./literal.js'),
        section: require('./section.js'),
        segment: require('./segment.js')
    },
            
    manager = function( application ){
        this.app = application;

        this.routes={};
        this.routers={};
        this.compiledRoutes={};    
    
        // Initialize routers
        for( var model in defaultrouters )
            this.routers[model] = new (defaultrouters[model])(this);
    };

manager.prototype.configure = function( routing, next ){    
    if( routing ){
        // Set routers.
        if( routing.routers ){
            Object.keys(routing.routers).map(function(name){
                this.addRouter( name, routing.routers[name] ); 
            }.bind(this));
        }
        // Compile routes.
        if( routing.routes )
            this.addRoutes(routing.routes);
    }
    next();
};

manager.prototype.addRouter = function( name, router ){
    // IF 'router' is a module relative path.
    if( typeof(router) === 'string' )
        router = require(this.app.__DIR__+router);

    this.routers[name] = new router(this);
};

manager.prototype.addRoutes = function( routes ){
    if( routes instanceof Object ){
        for( var name in routes )
            this.addRoute( name, routes[name]);
    }
};

manager.prototype.addRoute = function(name, route){
    this.routes[name] = route;
    if( this.routers[route.type] )
        this.routers[route.type].compile( route, name );
};

/*
 * Resolve routage from a request. Return false if route does not exist or an object like:
 *  { controller:'controller',name:'routeName',action:'controllerAction',params:{ "here=>Request parameters" }}
 */
manager.prototype.resolve = function(route){
    var routeObject = false;
    for( var router in this.routers ){
        routeObject = this.routers[router].match(route);
        if( routeObject )
            return routeObject;
    }
    return routeObject;
};

/*
 * Generate an url string from routeName & given parameters.
 * /!\ Does not verify that parameters match route constraints !
 */
manager.prototype.url = function(routeName,parameters){
    for( var router in this.routers ){
        var url = this.routers[router].url(routeName,parameters);
        if( url )
            return url;
    }
};

module.exports = manager;