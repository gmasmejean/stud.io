/* 
 * Manage the application process:
 *     - configure the app: 
 *          - set declared modules
 *          - set events routines
 *          - set declared routes
 *          
 *     - handle: Get request & dispatch it to a new context.
 *     - route: Route a context to a controller's action.
 *     - render: Process context view.
 *     - send: Return a context response.
 *     
 * Application events:
 *     - ready: fired after application was successfully configured.
 *     - handle: fired when application get a request.
 *     - routed: fired when request was routed to a controller.
 *     - processed: fired before rendering response.
 *     - rendered: fired after rendering response.
 *     - sent: fired after sending response.
 *     
 */

var moduleManager = require('./modules/manager.js'),
    serviceManager = require('./services/manager.js'),
    viewManager = require('./views/manager.js'),
    routeManager = require('./routes/manager.js'),
    eventManager = require('./events/manager.js'),
    helperManager = require('./helpers/manager.js'),
    
    error = require('./error.js'),
    context = require('../context/context.js'),

    // Utility wrapper
    util = require('../utilities/utilities.js'),
    path = require('path');
    
var application = function(configuration){
    // Set main path.
    this.__DIR__ = path.dirname(require.main?require.main.filename:'')+'/';
    
    // Init options object.
    this.options = {};
    
    // Set managers.
    this.setModuleManager();
    this.setServiceManager();
    this.setViewManager();
    this.setRouteManager();
    this.setEventManager();
    this.setHelperManager();

    if(configuration)
        this.configure(configuration,this.ready.bind(this));
};

/// Setters ///
application.prototype.setModuleManager = function(){    
    this.moduleManager = new moduleManager(this);
};

application.prototype.setServiceManager = function(){    
    this.serviceManager = new serviceManager(this);
};

application.prototype.setHelperManager = function(){    
    this.helperManager = new helperManager(this);
};

application.prototype.setRouteManager = function(){    
    this.routeManager = new routeManager(this);
};

application.prototype.setViewManager = function(){    
    this.viewManager = new viewManager(this);
};

application.prototype.setEventManager = function(){
    this.eventManager = new eventManager(this);
};

/// Binding context ///
application.prototype.context = context;

/// Application configuration ///
application.prototype.configure = function( configuration, next ){
    if( !configuration )
        return;

    if( typeof(configuration) === 'string' )
        configuration = require( this.__DIR__+configuration );

    var setLocaleConfiguration = function(){        
        util.parallel([
            [this.serviceManager.configure.bind(this.serviceManager),[configuration.services,this.__DIR__]],
            [this.helperManager.configure.bind(this.helperManager),[configuration.helpers,this.__DIR__]],
            [this.viewManager.configure.bind(this.viewManager),[configuration.views,this.__DIR__]],
            [this.routeManager.configure.bind(this.routeManager),[configuration.routing]],
            [this.eventManager.configure.bind(this.eventManager),[configuration.events]]
        ])(next);
        
    }.bind(this);
    
    // Load all options. ( modules options, then local options )
    if( configuration.modules instanceof Object ){
        for( var name in configuration.modules )
            this.addOptions( configuration.modules.options );
    }
    this.addOptions( configuration.options );

    // Then load modules & load local components.
    this.moduleManager.configure( configuration.modules, this.__DIR__, setLocaleConfiguration );
};

// Overwrite/Add some of application options.
application.prototype.addOptions = function( options ){
    if( options )
        this.options = util.extend( this.options, options);
};

/// EVENTS MANAGEMENT \\\
/* Shortcut to event manager */
application.prototype.on = function(){ 
    this.eventManager.on.apply(this.eventManager,arguments);
    return this;
};

application.prototype.off = function(){
    this.eventManager.off.apply(this.eventManager,arguments);
    return this;
};

application.prototype.emit = function(){
    this.eventManager.emit.apply(this.eventManager,arguments);
    return this;
};

application.prototype.throw = function( err, datas ){
    this.emit('error',new error(err,datas));
};

/// DEFAULT FINAL EVENT FUNCTIONS \\\
application.prototype.ready = function(){
    // Bind final events for application default events flow.
    this.on('ready',this.handle.bind(this),'final')
        .on('handled',this.route.bind(this),'final')
        .on('routed',this.process.bind(this),'final')
        .on('processed',this.render.bind(this),'final')
        .on('rendered',this.send.bind(this),'final');
    
    // Emit "ready" event.
    this.emit('ready');
};

application.prototype.handle = function(request,response){
    var ctx = new context(this,request,response);
    this.emit('handled',ctx);
};

application.prototype.route = function( ctx ){    
    var routeObject = this.routeManager.resolve( ctx.request.parsedUrl.pathname );
    
    if( routeObject && routeObject.controller && routeObject.action ){        
        var ctrlPath = this.moduleManager.controllers[routeObject.controller];
        if( ctrlPath ){
            
            ctx.controller = new (require(ctrlPath))( ctx );
            ctx.action = routeObject.action;
            
            this.emit('routed',ctx);
        }else{
            // THROW ERROR => CONTROLLER DOES NOT EXISTS
            ctx.response.statusCode = 404;
            ctx.error = new error('Page not found...','NO_CONTROLLER',{reason:'Controller does not exists.'});
            this.emit('error',ctx);
        }
    }
    else{
        // EMIT ERROR. CANNOT FIND A ROUTE MATCHING REQUEST.
        ctx.response.statusCode = 404;
        ctx.error = new error('Page not found...','NO_ROUTE',{reason:'No route matching request.'});
        this.emit('error',ctx);
    }
};

application.prototype.process = function( ctx ){
    if( ctx.controller && ctx.action && ctx.controller[ctx.action] ){
        ctx.controller[ctx.action]( function(){ this.emit('processed',ctx); }.bind(this) );
    }else{
        ctx.response.statusCode = 500;
        ctx.error = new error('Internal Server Error','INTERNAL_ERROR',{reason:'Controller action undefined.'});
        this.emit('error',ctx);
    }
};

application.prototype.render = function( ctx ){
    
    
    
};

application.prototype.send = function( ctx ){
    
};

module.exports = application;