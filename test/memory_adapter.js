var context = require('./context/context.js');
context.prototype.requestIp = function(){
    return '127.0.0.1';
};
var helper_session = require('./helpers/session/helper.js');
var app = require('./application/application.js');



var a = new app({
    helpers:{
        cookies:'helpers/cookies/helper.js'
    },
    events:{
        error: function( err ){
            console.log( err );
        }
    },
    services:{
        session:{
            unique: true, //false,
            adapter: '../node_modules/nfw/helpers/session/memory/adapter.js',
            memcache:{
                
            },
        }
    }
});
var ctx = new context(a,{headers:{}},{});
var help = new helper_session( ctx );

help.get(function(err,datas){
    console.log('get',err,datas);
});
console.log('------------------------------------------------');
help.setValue('toto','je suis une valeur.',function(err,datas){
    console.log('setValue',err,datas);
    help.getValue('toto',function(err,datas){
        console.log('getValue',err,datas);
        help.set([{blabla:123456,plop:'Salut !'},],function(err,datas){
            console.log('set',err,datas);
            help.get(function(err,datas){
                console.log('get',err,datas);
                help.destroy(function(err,datas){
                    console.log('destroy',err,datas);
                    help.get(function(err,datas){
                        console.log('get',err,datas);
                    });
                });
            });
        });
    });
});
console.log('------------------------------------------------');
help.setValue({},'je suis une valeur.',function(err,datas){
    console.log('setValue invalid name',err,datas);
});
help.setValue('bob',function(){},function(err,datas){
    console.log('setValue invalid value',err,datas);
});