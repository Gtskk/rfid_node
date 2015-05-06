var async = require('async'),
    _ = require('lodash');

// 引入日志记录
var logger = require('../util/logger.js');
// 引入redis
var r = require('./rfidRedis.js'),
    RfidNodejs = require('./rfid/rfid.js'),
    Config = require('./config.js');

/**
 * 标签检查模块
 */
function main()
{
	var readerConfigs = Config.getReaderConfig();
	var funcLists = [online, offline]; // 在架与离架标签数据处理函数
    var failedReaders = []; // 连接失败的读写器

	for (var ip in readerConfigs)
	{
        var readerConfig = readerConfigs[ip];
		var param = {
			host: ip,
			port: 9761,
			rssi: readerConfig.rssi,
			frequency: readerConfig.frequency,
			antInfos: readerConfig.ants,
			groupId: readerConfig.group,
			stay_time: readerConfig.stay_time,
			inventory_time: readerConfig.inventory_time
		};
		var rfid = new RfidNodejs();
	
		// 同步通过C#控制读写器
        async.retry(3, function(cb, results){
            if(rfid.open(param))
            {
                _.forEach(funcLists, function(func){
                    func(rfid);
                });
                cb(null, null);
            }
            else
            {
                logger.errorlogger.error('连接读写器'+ip+'错误');
                failedReaders.push(ip);
                cb(new Error('连接读写器'+ip+'错误'), failedReaders);
                //process.exit(1);
            }
        });
	}
}

/**
 * 检查在架标签
 * @param rf 读写器实例
 */
function online(rf)
{
	rf.on('onDataGet', function(onDatas)
	{
		var groupId;
		// 异步方式
		async.map(Object.keys(onDatas), function(epc, next)
		{
			var onEpc = null;

			// 保存在架标签到redis内存数据库
			var returnEpc = onDatas[epc];
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
			else if(groupId != undefined)
			{
                // 获取之前当前组在架标签，有就合并起来
                r.hget(groupId, 'on', function(err, redisDatas)
                {
                    if (err)
                    {
                        logger.errorlogger.error(err);
                    }
                    else
                    {
                        var filteredEpcs = [];
                        var readerIp;
                        try
                        {
                            redisDatas = JSON.parse(redisDatas);

                            // 过滤掉已经存到redis中并和当前属于同一读写器盘点到的标签
                            filteredEpcs = _.filter(redisDatas, function(redisData){
                                return (!redisData.host != readerIp && _.findWhere(onEpcs, {epc: redisData.epc}) === undefined);
                            });
                        }
                        catch(er)
                        {
                            logger.errorlogger.error('标签数据JSON格式错误：'+er);
                        }

                        r.hset(groupId, 'on', JSON.stringify(onEpcs.concat(filteredEpcs)), function(){});
                    }
                });
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
			if(returnEpc.epc && groupId != null)
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
			else if(groupId != undefined)
			{
                // 获取之前当前组在架标签
                r.hget(groupId, 'on', function(err, redisDatas)
                {
                    if (err)
                    {
                        logger.errorlogger.error(err);
                    }
                    else
                    {
                        try
                        {
                            redisDatas = JSON.parse(redisDatas);

                            // 过滤掉能在当前组在架标签的redis数据中查到的标签
                            offEpcs = _.filter(offEpcs, function(offEpc){
                               return (!offEpc || _.findWhere(redisDatas, {epc: offEpc.epc}) === undefined);
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
		});
	});
}

main();