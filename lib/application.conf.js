/* Default application configuration */

module.exports = {
    services:{
        redis: require('./services/storage/redis/service'),
        memcached: require('./services/storage/memcached/service')
    },
    helpers:{
        cookies:require('./helpers/cookies/helper'),
        session:require('./helpers/session/helper')
    }
};