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
    },
    options:{
        storages:{
            memcached:{
                servers:[
                    {
                        host: 'localhost',
                        port: 11211,
                        weight: 1
                    }
                ],
                config:{
                    maxKeySize: 250,
                    maxExpiration: 2592000,
                    maxValue: 1048576,
                    poolSize: 10,
                    algorithm: 'md5',
                    reconnect: 18000000,
                    timeout: 5000,
                    retries: 5,
                    failures: 5,
                    retry: 30000,
                    remove: false,
                    failOverServers: undefined,
                    keyCompression: true,
                    idle: 5000
                }
            },
            redis:{
                servers:[
                    {
                        host: 'localhost',
                        port: 6379
                    }
                ],
                config:{
                    
                }
            }
        }
    }
};