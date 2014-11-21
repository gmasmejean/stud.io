/* Default application configuration */

module.exports = {
    services:{
        redis: { 
            unique: true,
            service:require('./services/storage/redis/service')
        },
        memcached:{
            unique: true,
            service:require('./services/storage/memcached/service')
        }
    },
    helpers:{
        cookies:require('./helpers/cookies/helper'),
        session:require('./helpers/session/helper')
    }
};