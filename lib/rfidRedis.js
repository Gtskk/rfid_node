var redis = require('redis');
// 引入日志记录
var logger = require('../util/logger'),
    defines = require('./define.js');

var r = redis.createClient(defines.REDIS_PORT, defines.REDIS_HOST, {});
r.on('error', function(err)
{
	logger.errorlogger.error('Redis连接错误：'+err);
});

module.exports = r;