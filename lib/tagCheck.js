var redis = require('redis');
var r = redis.createClient();

// 处理redis错误
r.on("error", function (err) {
   	console.log(err);
});

// 引入日志记录
var logger = require('../util/logger');

var RfidNodejs = require('./rfid/rfid.js');

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
			antInfos: readerConfigs[ip].ants
		};
		var rfid = new RfidNodejs();

		// 异步通过C#控制读写器
		rfid.open(param, function(dat) {
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
			}
		});

		// if(rfid.open(param)) 
		// {

		// 	for (var j = 0; j < funclists.length; j++) 
		// 	{
		// 		funclists[j](rfid);
		// 	}
		// }
		// else
		// {
		// 	logger.errorlogger.error('连接读写器'+ip+'错误');
		// }
	}
}

// 检查在架标签
function online(rf)
{
	var groupId;
	rf.on('onDataGet', function(returnDatas)
	{
		// console.log(returnDatas);
		// Object.getOwnPropertyNames(returnDatas).length 
		// 判断对象是否为空
		var onEpcs = {};
		for(var epc in returnDatas)
		{
			var returnEpc = returnDatas[epc];
			var antPort = returnEpc.data.PORT;
			var ip = returnEpc.host;
			groupId = getGroupId(ip, antPort);
			if(groupId == null)
				return;

			onEpcs[epc] = returnEpc;

		}
		// console.log(Object.getOwnPropertyNames(returnDatas).length);
		
		if(groupId != undefined)
		{
			r.hdel(groupId, 'on', function(){});
			r.hset(groupId, 'on', JSON.stringify(onEpcs), function(){});
		}
	});
}
// 检查离架标签
function offline(rf)
{
	var groupId;
	rf.on('offDataGet', function(returnDatas)
	{
		var onEpcs = {};
		for(var epc in returnDatas)
		{
			var returnEpc = returnDatas[epc];
			var antPort = returnEpc.data.PORT;
			var ip = returnEpc.host;
			groupId = getGroupId(ip, antPort);
			if(groupId == null)
				return;

			onEpcs[epc] = returnEpc;
		}

		// logger.debuglogger.debug(onEpcs);

		if(groupId != undefined)
		{
			r.hdel(groupId, 'off', function(){});
			r.hset(groupId, 'off', JSON.stringify(onEpcs), function(){});
		}
	});
}

 /**
 * 根据读写器ip和天线端口获取组ID
 * @param {String} ip 读写器IP
 * @param {String} ant 读写器天线端口号
 * @return {Integer} 返回组ID或者NULL
 */
function getGroupId(ip, ant)
{
	var groupsInfo = config.groupsInfo;
	for (var i in groupsInfo) 
	{
		var groupInfo = groupsInfo[i];
		for (var j = 0; j < groupInfo.length; j++) 
		{
			var group = groupInfo[j];
			if(ip === group.readerIp && group.antId === ant)
				return i;
		}
	}

    return null;
}

main();