var async = require('async');

// 引入日志记录
var logger = require('../util/logger');
// 引入redis
var r = require('./rfidRedis');

var RfidNodejs = require('./rfid/rfid.js');
var RssiCalc = require('./rssi.js');

var config = require('./config.js').config;

/**
 * 标签检查模块
 */
function main()
{
	var readerConfigs = config.getReaderConfig();
	var funclists = [online, offline];//, workLine, workToOnline, workToOffline, onToOffline];

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

		// 异步通过C#控制读写器
		/*rfid.open(param, function(dat) {
			if(dat)
			{
				for (var j = 0; j < funclists.length; j++) 
				{
					funclists[j](rfid);
				}
			}
			else
			{
				logger.errorlogger.error('连接读写器'+ip+'错误');
				process.exit(1);
			}
		});*/
	
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

// 检查在架标签
function online(rf)
{
	rf.on('onDataGet', function(returnDatas)
	{
		var groupId;
		// 异步方式
		async.map(Object.keys(returnDatas), function(epc, next)
		{
			var onEpc = null;
			// 添加标签RSSI有关数据到REDIS
			/*r.llen(epc, function(err, len)
			{
				if(err) next(err, onEpc);
				if(len < 50)
				{
					var returnEpc = returnDatas[epc];
					r.lpush(epc, returnEpc.data.RSSI, function(){});
				}
				else if(len == 50)
				{
					var rssi = new RssiCalc();
					rssi.on('rssiCalc', function()
					{
						rssi.proc(epc);
					});
					rssi.rssiCalcCallback();
				}
			});*/

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
					r.hset(groupId, 'on', JSON.stringify(onEpcs), function(){});
				}
			}
		});

		// 同步方式
		// Object.getOwnPropertyNames(returnDatas).length  判断对象是否为空
		// var onEpcs = {}; 
		// for(var epc in returnDatas)
		// {
		// 	var returnEpc = returnDatas[epc];
		// 	var antPort = returnEpc.data.PORT;
		// 	var ip = returnEpc.host;
		// 	groupId = getGroupId(ip, antPort);
		// 	if(groupId == null)
		// 		return;

		// 	onEpcs[epc] = returnEpc;

		// }
		// // console.log(Object.getOwnPropertyNames(returnDatas).length);
		
		// if(groupId != undefined)
		// {
		// 	// r.hdel(groupId, 'on', function(){});
		// 	r.hset(groupId, 'on', JSON.stringify(onEpcs), function(){});
		// }
	});
}
// 检查离架标签
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

			/*r.hget('rssiRef', epc, function(e, rssiRef)
			{
				var offEpc = null;
				var returnEpc = returnDatas[epc];
				groupId = returnEpc.group;
				if(returnEpc.data)
				{
					var epcRssi = returnEpc.data.RSSI;
					if(groupId != null)
					{
						offEpc = returnEpc;
					}
				}
				
				if(e) 
					next(e, offEpc);
				else 
					next(null, offEpc);
			});*/
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
					r.hset(groupId, 'off', JSON.stringify(offEpcs), function(){});
				}
			}
		});


		// 同步方式
		// var offEpcs = {};
		// for(var epc in returnDatas)
		// {
		// 	var returnEpc = returnDatas[epc];
		// 	var antPort = returnEpc.data.PORT;
		// 	var ip = returnEpc.host;
		// 	groupId = getGroupId(ip, antPort);
		// 	if(groupId == null)
		// 		return;

		// 	offEpcs[epc] = returnEpc;
		// }

		// // logger.debuglogger.debug(offEpcs);

		// if(groupId != undefined)
		// {
		// 	r.hset(groupId, 'off', JSON.stringify(offEpcs), function(){});
		// }
	});
}

 /**
 * 根据读写器ip和天线端口获取组ID
 * @param {String} ip 读写器IP
 * @param {String} ant 读写器天线端口号
 * @return {Integer} 返回组ID或者NULL
 */
// function getGroupId(ip, ant)
// {
// 	var groupsInfo = config.groupsInfo;
// 	for (var i in groupsInfo) 
// 	{
// 		var groupInfo = groupsInfo[i];
// 		for (var j = 0; j < groupInfo.length; j++) 
// 		{
// 			var group = groupInfo[j];
// 			if(ip === group.readerIp && group.antId === ant)
// 				return i;
// 		}
// 	}

//     return null;
// }

main();
