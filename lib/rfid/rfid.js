var edge = require('edge'), 
	path = require('path'),
	redis = require('redis'),
	events = require('events'),
	util = require('util');

var config = require('../config.js').config;
var ips = config.getReaderIps();

/**
 * 通过edgejs控制RFID模块
 */
function RfidNodejs()
{
	events.EventEmitter.call(this);

	// 去除warning: possible EventEmitter memory leak detected. 11 listeners added.警告
	// this.setMaxListeners(0);

	this.edge = {};
	this.edge.open = edge.func({
		source: __dirname + path.sep + 'NodeRfid.cs',
	    typeName: 'NodeRfid.Startup',
	    methodName: 'Open',
	    references: [path.join(__dirname, 'JW.UHF.dll')]
	});
	this.edge.close = edge.func({
		source: __dirname + path.sep + 'NodeRfid.cs',
	    typeName: 'NodeRfid.Startup',
	    methodName: 'Close',
	    references: [path.join(__dirname, 'JW.UHF.dll')]
	});
}

util.inherits(RfidNodejs, events.EventEmitter);

/*function cloneObj(oldObj) 
{ //复制对象方法
	if (typeof(oldObj) != 'object') return oldObj;
	if (oldObj == null) return oldObj;
	var newObj = new Object();
	for (var i in oldObj){
		if(i == 'antInfos'){
			newObj[i] = oldObj[i];
		}else{
			newObj[i] = cloneObj(oldObj[i]);
		}
	}
	return newObj;
}
*/
RfidNodejs.prototype.open = function(param)
 {
	param.logCallback = this.logCallback.bind(this);
	param.offDataCallback = this.offDataCallback.bind(this);
	param.onDataCallback = this.onDataCallback.bind(this);
	
	return this.edge.open(param, true);
};

RfidNodejs.prototype.close = function() 
{
	return this.edge.close("", true);
};

// 调试函数
RfidNodejs.prototype.logCallback = function(msg) 
{
	console.log('[RfidNodejs]', msg);
};

// 离架数据
RfidNodejs.prototype.offDataCallback = function(input, callback) 
{
	this.emit('offDataGet', input);
};

// 在架数据
RfidNodejs.prototype.onDataCallback = function(input, callback)
{
	this.emit('onDataGet', input);
}

module.exports = RfidNodejs;

if(require.main == module)
{
	function main() {
		for (var i = 0; i < ips.length; i++) 
		{
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
			var rfid = new RfidNodejs();

			if(rfid.open(param)) 
			{
				console.log("rfid Opened");
				rfid.on('offDataGet', function(datas)
				{
					console.log(datas);
				});
			}
			else
			{
				console.log('连接读写器错误');
			}
		}
	}

	main();
}