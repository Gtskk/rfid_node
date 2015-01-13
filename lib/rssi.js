// 引入日志记录
var logger = require('../util/logger');
// 引入redis
var r = require('./rfidRedis');
var config = require('./config.js').config;

/**
 * 标签RSSI计算模块
 */
function main()
{
	var groupsIds = Object.keys(config.groupsInfo);

	for(var i in groupsIds)
	{
		r.hget(groupsIds[i], 'on', function(err, epcs)
		{
			if (err) {logger.errorlogger.error(err);}

			try
			{
				epcs = JSON.parse(epcs);
			}
			catch(er)
			{
				logger.errorlogger.error('JSON格式错误：'+er);
			}

			for(var epc in epcs)
			{
				r.llen(epc, function(err, l)
				{
					if(l >= 2)
					{
						r.lrange(epc, 0, -1, function(error, items)
						{
							if(error) throw error;
							var sum = 0;
							var len = items.length;
							if(len)
							{
								// 计算RSSI的平均值
								for(item in items)
								{
									sum += parseFloat(items[item]);
								}
								// 储存RSSI的平均值
								r.hset('rssiAver', epc, sum/len, function(){});
								console.log(sum);

								// 储存最高值
								r.hset('rssiMax', epc, items[len-1], function(){});

								// 储存最低值
								r.hset('rssiMin', epc, items[0], function(){});

								// 储存临界值
								r.hset('rssiRef', epc, items[0]-1, function(){});
								
							}
							
						});
					}
				})
			}
		});
	}
}

setTimeout(main, 2000);