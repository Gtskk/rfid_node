var redis = require('redis');
var r = redis.createClient();

var RfidNodejs = require('./lib/rfid.js');
var rfid = new RfidNodejs();

var config = require('./config.js').config;
var ips = config.getReaderIps();

var funclists = [online, workLine, workToOnline, workToOffline, onToOffline, offline];

function main(){

	// 清除redis内存数据库数据
	r.flushall(function(didSuccess){
		console.log('redis内存数据清理成功');
	});

	for (var i = 0; i < ips.length; i++) {
		var param = {
			host: ips[i],
			port: 9761,
			antInfos: [
				{
					antIndex: 3,
					antPower: 27
				}
			]
		};

		if(rfid.open(param)) {

			for (var j = 0; j < funclists.length; j++) {
				funclists[j](ips[i]);
			}
			//close the kinect after 5 seconds
			/*setTimeout(function(){
				rfid.close();
				console.log("rfid Closed");
			}, 5000);*/
		}else{
			console.log('连接读写器错误');
		}
	}
}

// 在架处理方法
function online(ip){
	var groupId;
	rfid.on('dataGet', function(returnDatas){
		// console.log(returnDatas);
		// Object.getOwnPropertyNames(returnDatas).length 
		// 判断对象是否为空
		var onEpcs = {};
		for(var epc in returnDatas){
			var antPort = returnDatas[epc].data.PORT;
			groupId = getGroupId(ip, antPort);
			if(groupId == null)
				return;

			onEpcs[epc] = returnDatas[epc];

		}
		r.hset(groupId, 'on', JSON.stringify(onEpcs), function(){});
	});
}

function workLine(ip){
	var groupId;
	rfid.on('workDataGet', function(returnDatas){
		var onEpcs = {};
		for(var epc in returnDatas){
			var antPort = returnDatas[epc].data.PORT;
			groupId = getGroupId(ip, antPort);
			if(groupId == null)
				return;

			onEpcs[epc] = returnDatas[epc];

		}
		r.hset(groupId, 'work', JSON.stringify(onEpcs));
	});
}
function workToOnline(ip){
	var groupId;
	rfid.on('workToOnLineDataGet', function(returnDatas){
		var onEpcs = {};
		for(var epc in returnDatas){
			var antPort = returnDatas[epc].data.PORT;
			groupId = getGroupId(ip, antPort);
			if(groupId == null)
				return;

			onEpcs[epc] = returnDatas[epc];

		}
		r.hset(groupId, 'work', JSON.stringify(onEpcs));
	});
}
function workToOffline(ip){
	var groupId;
	rfid.on('workToOfflineDataGet', function(returnDatas){
		var onEpcs = {};
		for(var epc in returnDatas){
			var antPort = returnDatas[epc].data.PORT;
			groupId = getGroupId(ip, antPort);
			if(groupId == null)
				return;

			onEpcs[epc] = returnDatas[epc];

		}
		r.hset(groupId, 'work', JSON.stringify(onEpcs));
	});
}
function onToOffline(ip){
	var groupId;
	rfid.on('onToOfflineDataGet', function(returnDatas){
		var onEpcs = {};
		for(var epc in returnDatas){
			var antPort = returnDatas[epc].data.PORT;
			groupId = getGroupId(ip, antPort);
			if(groupId == null)
				return;

			onEpcs[epc] = returnDatas[epc];

		}
		r.hset(groupId, 'on', JSON.stringify(onEpcs));
	});
}
function offline(ip){
	var groupId;
	rfid.on('offlineDataGet', function(returnDatas){
		var onEpcs = {};
		for(var epc in returnDatas){
			var antPort = returnDatas[epc].data.PORT;
			groupId = getGroupId(ip, antPort);
			if(groupId == null)
				return;

			onEpcs[epc] = returnDatas[epc];

		}
		r.hset(groupId, 'off', JSON.stringify(onEpcs));
	});
}

function getGroupId(ip, ant){
	var groupsInfo = config.groupsInfo;
	for (var i in groupsInfo) {
		var groupInfo = groupsInfo[i];
		for (var j = 0; j < groupInfo.length; j++) {
			var group = groupInfo[j];
			if(ip === group.readerIp && group.antId === ant)
				return i;
		}
	}

    return null;
}

main();