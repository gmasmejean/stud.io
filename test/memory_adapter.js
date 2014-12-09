var should = require('should');

describe('Memory Adapter',function(){
    
    // Initialization.
    var application = new (require('../lib/application/application'))({
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

    var context = new (require('../lib/context/context'))(application,{headers:{}},{});
    context.requestIp = function(){ return '127.0.0.1'; };
    
    var helper = new (require('../lib/helpers/session/helper'))( context );
    
    
    it('get with no session returns error MA_IK',function(done){
        helper.get(function(err,datas){
            err.should.instanceOf(Object).properties({
                name:'MEMORY_ADAPTER_INVALID_KEY',
                code:'MA_IK',
                message:'This session does not exist.'
            });
            done();
        });
    });
    it('setValue "je suis une valeur" to key "toto"',function(done){
        helper.setValue('toto','je suis une valeur.',function(err,datas){
            should.not.exist(err);
            done();
        });
    });
    it('getValue "je suis une valeur" with key "toto"',function(done){
        helper.getValue('toto',function(err,datas){
            datas.should.equal('je suis une valeur.');
            done();
        });
    });
    it('set {blabla:123456,plop:\'Salut !\'}',function(done){
        helper.set({blabla:123456,plop:'Salut !'},function(err,datas){
            should.not.exist(err);
            done();
        });
    });
    it('exist returns true',function(done){
        helper.exist(function(err,datas){
            datas.should.true;
            done();
        });
    });
    it('get',function(done){
        helper.get(function(err,datas){
            datas.should.instanceOf(Object).properties({
                blabla:123456,
                plop:'Salut !'
            });
            done();
        });
    });
    it('destroy',function(done){
        helper.destroy(function(err,datas){
            should.not.exist(err);
            done();
        });
    });
    it('get after destroy',function(done){
        helper.get(function(err,datas){
            err.should.instanceOf(Object).properties({
                name:'MEMORY_ADAPTER_INVALID_KEY',
                code:'MA_IK',
                message:'This session does not exist.'
            });
            done();
        });
    });
    it('exist returns false',function(done){
        helper.exist(function(err,datas){
            datas.should.false;
            done();
        });
    });
    it('setValue with invalid name returns error SH_IN',function(done){
        helper.setValue({},'je suis une valeur.',function(err,datas){
            err.should.instanceOf(Object).properties({
                name:'SESSION_HELPER_INVALID_NAME',
                code:'SH_IN',
                message:'Name is invalid.'
            });
            done();
        });
    });
    it('setValue with invalid value returns error SH_IV',function(done){
        helper.setValue('bob',function(){},function(err,datas){
            err.should.instanceOf(Object).properties({
                name:'SESSION_HELPER_INVALID_VALUE',
                code:'SH_IV',
                message:'Value is invalid.'
            });
            done();
        });
    });
});