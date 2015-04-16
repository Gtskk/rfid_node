var redis = require('redis');
// 引入日志记录
var logger = require('../util/logger');

var r = redis.createClient();
r.on('error', function(err)
{
	logger.errorlogger.error('Redis连接错误：'+err);
});

module.exports = r;