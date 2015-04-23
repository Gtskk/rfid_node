var async = require('async'),
	events = require('events'),
	util = require('util');

// 引入日志记录
var logger = require('../util/logger.js');
// 引入redis
var r = require('./rfidRedis.js');


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

RssiCalc.prototype.proc =  function(epc)
{

	r.llen(epc, function(err, l)
	{
		if(err) logger.errorlogger.error(err);
		if(l == 50)
		{
			r.sort(epc, function(error, items)
			{
				if(error) logger.errorlogger.error(error);
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
					r.hset('rssiRef', epc, sum/len, function(){});
					r.lpush(epc, 0, function(){});
				}
							
			});
		}
	});
}

module.exports = RssiCalc;
