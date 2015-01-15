var async = require('async'),
	events = require('events'),
	util = require('util');

// 引入日志记录
var logger = require('../util/logger');
// 引入redis
var r = require('./rfidRedis');
var config = require('./config.js').config;


/**
 * 标签RSSI计算模块
 */
function RssiCalc() {
	events.EventEmitter.call(this);
}
util.inherits(RssiCalc, events.EventEmitter);
// RSSI计算事件
RssiCalc.prototype.rssiCalcCallback = function() 
{
	this.emit('rssiCalc');
};

RssiCalc.prototype.proc =  function()
{
	var groupsIds = Object.keys(config.groupsInfo);

	async.eachSeries(groupsIds, function(groupId, callback)
	{
		r.hget(groupId, 'on', function(err, epcs)
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
			var epcVals = [];
			if(epcs)
			{
				for(var tag in epcs)
				{
					epcVals.push(epcs[tag].data.EPC);
				}
			}

			async.eachSeries(epcVals, function(epc, next)
			{
				r.llen(epc, function(err, l)
				{
					if(err) next(err);
					if(l >= 2)
					{
						r.lrange(epc, 0, -1, function(error, items)
						{
							if(error) next(error);
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

								// 储存最高值
								r.hset('rssiMax', epc, items[len-1], function(){});

								// 储存最低值
								r.hset('rssiMin', epc, items[0], function(){});

								// 储存临界值
								r.hset('rssiRef', epc, items[0]-1, function(){});
							}
							
						});
					}
					next();
				});
			}, function(er)
			{
				if(er)
				{
					logger.errorlogger.error('处理RSSI数据时出错,错误信息为：'+er);
				}
			});
		});

		callback();
	}, function(e)
	{
		if(e)
		{
			logger.errorlogger.error('处理RSSI有关组数据时出错,错误信息为：'+e);
		}
	});
}

module.exports = RssiCalc;