var async = require('async');

// 引入日志记录
var logger = require('../util/logger.js');
// 引入redis
var r = require('./rfidRedis.js'),
    RfidNodejs = require('./rfid/rfid.js'),
    config = require('./config.js');

/**
 * 标签检查模块
 */
function main()
{
	var readerConfigs = config.getReaderConfig();
	var funclists = [online, offline];//, workLine, onToOffline];

	for (var ip in readerConfigs)
	{
		var param = {
			host: ip,
			port: 9761,
			rssi: readerConfigs[ip].rssi,
			frequency: readerConfigs[ip].frequency,
			antInfos: readerConfigs[ip].ants,
			groupId: readerConfigs[ip].group,
			stay_time: readerConfigs[ip].stay_time,
			inventory_time: readerConfigs[ip].inventory_time
		};
		var rfid = new RfidNodejs();
	
		// 同步通过C#控制读写器
		if(rfid.open(param)) 
		{

			for (var j = 0; j < funclists.length; j++) 
			{
				funclists[j](rfid);
			}
		}
		else
		{
			logger.errorlogger.error('连接读写器'+ip+'错误');
			//process.exit(1);
		}
	}
}

/**
 * 检查在架标签
 * @param rf 读写器实例
 */
function online(rf)
{
	rf.on('onDataGet', function(returnDatas)
	{
		var groupId;
		// 异步方式
		async.map(Object.keys(returnDatas), function(epc, next)
		{
			var onEpc = null;

			// 保存在架标签到redis内存数据库
			var returnEpc = returnDatas[epc];
			groupId = returnEpc.group;
			if(groupId != null)
				onEpc = returnEpc;

			next(null, onEpc);

		}, function(er, onEpcs)
		{
			if(er)
			{
				logger.errorlogger.error(er);
			}
			else
			{
				if(groupId != undefined)
				{
					// 获取之前当前组在架标签，有就合并起来
					r.hget(groupId, 'on', function(err, epcs)
					{
						if (err)
                        {
                            logger.errorlogger.error(err);
                        }
                        else
                        {
                            var allEpcs = [], temp = [];
                            var readerIp;
                            try
                            {
                                epcs = JSON.parse(epcs);
                                for(var i in onEpcs)
                                {
                                    var onEpc = onEpcs[i];
                                    temp[onEpc.data.EPC] = true;
                                    readerIp = onEpc.host;
                                }
                                for(var j in epcs)
                                {
                                    var cachedData = epcs[j];
                                    if(!cachedData.host != readerIp && !temp[cachedData.data.EPC])
                                    {
                                        allEpcs.push(cachedData);
                                    }
                                }
                            }
                            catch(er)
                            {
                                logger.errorlogger.error('标签数据JSON格式错误：'+er);
                            }

                            r.hset(groupId, 'on', JSON.stringify(onEpcs.concat(allEpcs)), function(){});
                        }
					});

				}
			}
		});
	});
}

/**
 * 检查离架标签
 * @param rf 读写器实例
 */
function offline(rf)
{
	rf.on('offDataGet', function(returnDatas)
	{
		var groupId;
		// 异步方式
		async.map(Object.keys(returnDatas), function(epc, next)
		{
			var offEpc = null;
			var returnEpc = returnDatas[epc];
			groupId = returnEpc.group;
			if(returnEpc.data && groupId != null)
			{
				offEpc = returnEpc;
			}
			next(null, offEpc);
		}, function(er, offEpcs)
		{
			if(er)
			{
				logger.errorlogger.error(er);
			}
			else
			{
				if(groupId != undefined)
				{
					// 获取之前当前组在架标签
					r.hget(groupId, 'on', function(err, epcs)
					{
						if (err)
                        {
                            logger.errorlogger.error(err);
                        }
                        else
						{
							try
							{
								epcs = JSON.parse(epcs);
								offEpcs.filter(function(item){
									for(var j in epcs)
									{
										var cachedData = epcs[j];
										if(item && cachedData.data.EPC == item.data.EPC)
											return false;
									}
									return true;
								});
							}
							catch(er)
							{
								logger.errorlogger.error('标签数据JSON格式错误：'+er);
							}

                            r.hset(groupId, 'off', JSON.stringify(offEpcs), function(){});
						}
					});
				}
			}
		});
	});
}

main();