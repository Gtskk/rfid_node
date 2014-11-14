/**
 * log4js 调试模块
 */
 
var log4js = require('log4js');

// 定义三种logLevelFilter日志类型
var logConfig = {
    appenders: [
        {type: 'console'},
        {
            type: 'logLevelFilter',
            level: 'ERROR',
            category: 'error',
            appender: 
            {
                type: 'file',
                filename: __dirname + '/../logs/error.log'
            }
        },
        {
            type: 'logLevelFilter',
            level: 'INFO',
            category: 'info',
            appender: 
            {
                type: 'file',
                filename: __dirname + '/../logs/info.log'
            }
        },
        {
            type: 'logLevelFilter',
            level: 'DEBUG',
            category: 'debug',
            appender: 
            {
                type: 'file',
                filename: __dirname + '/../logs/debug.log'
            }
        }
    ]
};

log4js.configure(logConfig);
exports.infologger = log4js.getLogger('info');
exports.errorlogger = log4js.getLogger('error');
exports.debuglogger = log4js.getLogger('debug');