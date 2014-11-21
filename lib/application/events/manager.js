/* 
 * Event Manager.
 * Load event configuration.
 */
var util = require('../../utilities/utilities.js');

var manager = function( target ){
    this.target = target;
    this.events = {}; 
};

manager.prototype.configure = function( events, next ){
    if( events instanceof Object ){
        var l, i;
        for( var evt in events ){
            if( Array.isArray(events[evt]) ){
                l = events[evt].length, i=0;
                for(;i<l;i++)
                    this.on(evt,events[evt][i]);
            }
        }
    }
    if( next )
        next();
};

manager.prototype.on = function( event, datas ){
    if( typeof(datas.callback) === 'function' && typeof(event)==='string' ){
        var type = datas.type || 'sync';
        
        if( !this.events[event] )
            this.events[event] = {sync:{},async:[],final:undefined,priorities:[]};
        
        if( type === 'sync'){
            var priority;
            if( datas.priority ){
                priority = datas.priority;
                this.events[event].priorities.push( priority );
                this.events[event].priorities.sort();                
            }else{
                var l = this.events[event].priorities.length;
                priority = l?this.events[event].priorities[l-1]+1:0;
                this.events[event].priorities.push(priority);
            }
            if( this.events[event].sync[priority] )
                this.events[event].sync[priority].push(datas.callback);
            else
                this.events[event].sync[priority] = [datas.callback];
            
        }else if( type === 'async'){
            this.events[event].async.push(datas.callback);
        }else if( type === 'final'){
            this.events[event].final = datas.callback;
        }
    }
    return this;
};

manager.prototype.clear = function(){
    this.events = {};
    return this;
};

manager.prototype.off = function( event ){    
    if( !event )
        return this.clear();
    else
        this.events[event] = undefined;
    return this;
};

manager.prototype.emit = function( event, args ){
    if( typeof(event) === 'string' && this.events[event] ){
        
        var asyncs=[], i=0, asynclength=this.events[event].async.length,
            syncs = [], k=0, p = this.events[event].priorities, synclength = p.length;
    
        if( asynclength ){
            for(;i<asynclength;i++)
                asyncs.push([this.events[event].async[i].bind(this.target),[args]]);
        }
    
        if( synclength ){
            for(;k<synclength;k++)                
                for( var fn in this.events.sync[p[k]] )
                    syncs.push([this.events[event].sync[p[k]][fn].bind(this.target),[args]]);
            
            asyncs.push([util.chain( syncs )]);
        }
        
        util.parallel( asyncs )( this.events[event].final?this.events[event].final.bind(this,args):undefined );
    }
    return this;
};























manager.prototype.off = function( event, fn ){
    var evts = (event === '*' || !event )?Object.keys(this.eventStack):event.split(',');
    
    if( fn && fn instanceof Function ){
        for( var i=0; i<evts.length; i++){
            if( this.eventStack[evts[i]] ){                
                // Remove function from async event stack.
                var idx = this.eventStack[evts[i]].async.indexOf(fn);
                if( idx > -1 )
                    this.eventStack[evts[i]].async.splice(idx,1);
                
                // Remove function from sync event stack.
                for( var p in this.eventStack[evts[i]].sync ){
                    idx = this.eventStack[evts[i]].sync[p].indexOf(fn);
                    if( idx > -1 )
                        this.eventStack[evts[i]].sync[p].splice(idx,1);
                    if( !this.eventStack[evts[i]].sync[p].length ){
                        this.eventStack[evts[i]].sync[p] = null;
                        this.eventStack[evts[i]].priorities.splice( this.eventStack[evts[i]].priorities.indexOf(p),1 );
                    }
                }
            }
        }
    }else{
        for( var i=0; i<evts.length; i++)
            if( this.eventStack[evts[i]] )
                this.eventStack[evts[i]] = {sync:{},async:[],priorities:[],final:this.eventStack[evts[i]].final};
    }    
    return this;
};


module.exports = manager;