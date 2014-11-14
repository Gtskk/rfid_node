var redis = require('redis');
var r = redis.createClient();

// 引入日志记录
var logger = require('../util/logger');

var RfidNodejs = require('./rfid/rfid.js');
var rfid = new RfidNodejs();

var config = require('./config.js').config;
var ips = config.getReaderIps();

var funclists = [online, offline];//, workLine, workToOnline, workToOffline, onToOffline];

/**
 * 标签检查模块
 */
function main()
{

	// 清除redis内存数据库数据
	r.flushall(function(didSuccess)
	{
		logger.infologger.info('redis内存数据清理成功');
	});

	for (var i = 0; i < ips.length; i++) 
	{
		var param = {
			host: ips[i],
			port: 9761,
			antInfos: 
			[
				{
					antIndex: 3,
					antPower: 27
				}
			]
		};

		if(rfid.open(param)) 
		{

			for (var j = 0; j < funclists.length; j++) 
			{
				funclists[j](ips[i]);
			}
			//close the kinect after 5 seconds
			/*setTimeout(function(){
				rfid.close();
				console.log("rfid Closed");
			}, 5000);*/
		}
		else
		{
			logger.errorlogger.error('连接读写器错误');
		}
	}
}

// 检查在架标签
function online(ip)
{
	var groupId;
	rfid.on('onDataGet', function(returnDatas)
	{
		// console.log(returnDatas);
		// Object.getOwnPropertyNames(returnDatas).length 
		// 判断对象是否为空
		var onEpcs = {};
		for(var epc in returnDatas)
		{
			var antPort = returnDatas[epc].data.PORT;
			groupId = getGroupId(ip, antPort);
			if(groupId == null)
				return;

			onEpcs[epc] = returnDatas[epc];

		}
		r.hset(groupId, 'on', JSON.stringify(onEpcs), function(){});
	});
}
// 检查离架标签
function offline(ip)
{
	var groupId;
	rfid.on('offlineDataGet', function(returnDatas)
	{
		var onEpcs = {};
		for(var epc in returnDatas)
		{
			var antPort = returnDatas[epc].data.PORT;
			groupId = getGroupId(ip, antPort);
			if(groupId == null)
				return;

			onEpcs[epc] = returnDatas[epc];

		}
		r.hset(groupId, 'off', JSON.stringify(onEpcs));
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

// function workLine(ip){
// 	var groupId;
// 	rfid.on('workDataGet', function(returnDatas){
// 		var onEpcs = {};
// 		for(var epc in returnDatas){
// 			var antPort = returnDatas[epc].data.PORT;
// 			groupId = getGroupId(ip, antPort);
// 			if(groupId == null)
// 				return;

// 			onEpcs[epc] = returnDatas[epc];

// 		}
// 		r.hset(groupId, 'work', JSON.stringify(onEpcs));
// 	});
// }
// function workToOnline(ip){
// 	var groupId;
// 	rfid.on('workToOnLineDataGet', function(returnDatas){
// 		var onEpcs = {};
// 		for(var epc in returnDatas){
// 			var antPort = returnDatas[epc].data.PORT;
// 			groupId = getGroupId(ip, antPort);
// 			if(groupId == null)
// 				return;

// 			onEpcs[epc] = returnDatas[epc];

// 		}
// 		r.hset(groupId, 'work', JSON.stringify(onEpcs));
// 	});
// }
// function workToOffline(ip){
// 	var groupId;
// 	rfid.on('workToOfflineDataGet', function(returnDatas){
// 		var onEpcs = {};
// 		for(var epc in returnDatas){
// 			var antPort = returnDatas[epc].data.PORT;
// 			groupId = getGroupId(ip, antPort);
// 			if(groupId == null)
// 				return;

// 			onEpcs[epc] = returnDatas[epc];

// 		}
// 		r.hset(groupId, 'work', JSON.stringify(onEpcs));
// 	});
// }
// function onToOffline(ip){
// 	var groupId;
// 	rfid.on('onToOfflineDataGet', function(returnDatas){
// 		var onEpcs = {};
// 		for(var epc in returnDatas){
// 			var antPort = returnDatas[epc].data.PORT;
// 			groupId = getGroupId(ip, antPort);
// 			if(groupId == null)
// 				return;

// 			onEpcs[epc] = returnDatas[epc];

// 		}
// 		r.hset(groupId, 'on', JSON.stringify(onEpcs));
// 	});
// }

main();