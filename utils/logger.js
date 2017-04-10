var log4js = require('log4js')
var path = require('path')
var env = process.env.NODE_ENV || 'development'
var log4jsConfig
switch (env) {
    case 'development':
        {
            log4jsConfig = {
                appenders: [{
                        type: 'console'
                    },
                    {
                        'type': 'dateFile',
                        'filename': path.join(__dirname, '../logs/access.log'),
                        'pattern': '-yyyy-MM-dd.log',
                        'category': 'access'
                    },
                    {
                        'type': 'dateFile',
                        'filename': path.join(__dirname, '../logs/app/app.log'),
                        'pattern': '-yyyy-MM-dd.log'
                    },
                    {
                        'type': 'file',
                        'filename': path.join(__dirname, '../logs/app.log'),
                        'maxLogSize': 10485760,
                        'numBackups': 3
                    },
                    {
                        'type': 'logLevelFilter',
                        'level': 'ERROR',
                        'appender': {
                            'type': 'file',
                            'filename': path.join(__dirname, '../logs/errors.log')
                        }
                    },
                    {
                        'type': 'file',
                        'filename': path.join(__dirname, '../logs/cluster.log'),
                        'category': 'cluster'
                    }
                ]
            }
            break
        }
    case 'test':
        {
            log4jsConfig = path.join(__dirname, '../config/log/log4j_configuration_test.json')
            break
        }
    case 'experience':
        {
            log4jsConfig = path.join(__dirname, '../config/log/log4j_configuration_test.json')
            break
        }
    case 'production':
        {
            log4jsConfig = path.join(__dirname, '../config/log/log4j_configuration_production.json')
            break
        }
    default:
        throw new Error('没有对应的配置文件')
}
log4js.configure(log4jsConfig, {
    reloadSecs: 60
})
module.exports.log4js = log4js
module.exports.Logger = function (name) {
    var logger = log4js.getLogger(name)
    logger.setLevel('info')
    return logger
}