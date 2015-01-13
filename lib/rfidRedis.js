var redis = require('redis');

var r = redis.createClient();
r.on('error', function(err)
{
	logger.errorlogger.error('Redis错误：'+err);
});

module.exports = r;