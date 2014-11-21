/* 
 * Module Manager.
 * Load modules configuration.
 */
var util = require('../../utilities/utilities.js');

var manager = function( application ){
    this.app = application;
};

manager.prototype.configure = function( modules, source_path, next ){
    var fns = [];
    if( modules instanceof Object ){
        for( var name in modules )
            fns.push([this.load.bind(this),[source_path+'/'+modules[name]+'/']]);
    }
    util.parallel(fns)(next);
};

manager.prototype.load = function( path, next){
    var configuration = require(path+'module.conf.js');
    
    util.parallel([
        [this.app.serviceManager.configure.bind(this.app.serviceManager),[configuration.services,path]],
        [this.app.helperManager.configure.bind(this.app.helperManager),[configuration.helpers,path]],
        [this.app.viewManager.configure.bind(this.app.viewManager),[configuration.views,path]],
        [this.app.routeManager.configure.bind(this.app.routeManager),[configuration.routes]],
        [this.app.eventManager.configure.bind(this.app.eventManager),[configuration.events]]
    ])(next);
};

module.exports = manager;