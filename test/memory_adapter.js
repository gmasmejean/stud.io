var should = require('should');
var context = require('../lib/context/context');
context.prototype.requestIp = function(){
    return '127.0.0.1';
};
var helper_session = require('../lib/helpers/session/helper');
var app = require('../lib/application/application');



var a = new app({
    events:{
        error: function( err ){
            console.log( err );
        }
    },
    options:{
        session:{
            adapter: '../../helpers/session/memory/adapter'
        }
    }
});
var ctx = new context(a,{headers:{}},{});
var help = new helper_session( ctx );

describe('Memory Adapter',function(){
    it('get with no session returns error MA_IK',function(done){
        help.get(function(err,datas){
            err.should.instanceOf(Object).properties({
                name:'MEMORY_ADAPTER_INVALID_KEY',
                code:'MA_IK',
                message:'This session does not exist.'
            });
            done();
        });
    });
    it('setValue "je suis une valeur" to key "toto"',function(done){
        help.setValue('toto','je suis une valeur.',function(err,datas){
            should.not.exist(err);
            done();
        });
    });
    it('getValue "je suis une valeur" with key "toto"',function(done){
        help.getValue('toto',function(err,datas){
            datas.should.equal('je suis une valeur.');
            done();
        });
    });
    it('set {blabla:123456,plop:\'Salut !\'}',function(done){
        help.set({blabla:123456,plop:'Salut !'},function(err,datas){
            should.not.exist(err);
            done();
        });
    });
    it('exist returns true',function(done){
        help.exist(function(err,datas){
            datas.should.true;
            done();
        });
    });
    it('get',function(done){
        help.get(function(err,datas){
            datas.should.instanceOf(Object).properties({
                blabla:123456,
                plop:'Salut !'
            });
            done();
        });
    });
    it('destroy',function(done){
        help.destroy(function(err,datas){
            should.not.exist(err);
            done();
        });
    });
    it('get after destroy',function(done){
        help.get(function(err,datas){
            err.should.instanceOf(Object).properties({
                name:'MEMORY_ADAPTER_INVALID_KEY',
                code:'MA_IK',
                message:'This session does not exist.'
            });
            done();
        });
    });
    it('exist returns false',function(done){
        help.exist(function(err,datas){
            datas.should.false;
            done();
        });
    });
    it('setValue with invalid name returns error SH_IN',function(done){
        help.setValue({},'je suis une valeur.',function(err,datas){
            err.should.instanceOf(Object).properties({
                name:'SESSION_HELPER_INVALID_NAME',
                code:'SH_IN',
                message:'Name is invalid.'
            });
            done();
        });
    });
    it('setValue with invalid value returns error SH_IV',function(done){
        help.setValue('bob',function(){},function(err,datas){
            err.should.instanceOf(Object).properties({
                name:'SESSION_HELPER_INVALID_VALUE',
                code:'SH_IV',
                message:'Value is invalid.'
            });
            done();
        });
    });
});