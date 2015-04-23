var edge = require('edge'), 
	path = require('path'),
	events = require('events'),
	util = require('util');

// 引入日志记录
var logger = require('../../util/logger.js');

/**
 * 通过edgejs控制RFID模块
 * 继承EventEmitter内部模块，然后调用emit和on的方式去监听
 * 读写器信息的变化
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
	    // 日志有关dll索引
	    // references: [path.join(__dirname, 'JW.UHF.dll'), path.join(__dirname, 'JW.LOG.dll'), path.join(__dirname, 'log4net.dll')]
	});
	this.edge.close = edge.func({
		source: __dirname + path.sep + 'NodeRfid.cs',
	    typeName: 'NodeRfid.Startup',
	    methodName: 'Close',
	    references: [path.join(__dirname, 'JW.UHF.dll')]
	    // 日志有关dll索引
	    //references: [path.join(__dirname, 'JW.UHF.dll'), path.join(__dirname, 'JW.LOG.dll'), path.join(__dirname, 'log4net.dll')]
	});
}

util.inherits(RfidNodejs, events.EventEmitter);

// 异步方式调用edgejs
// RfidNodejs.prototype.open = function(param, callback)
// {
// 	param.logCallback = this.logCallback.bind(this);
// 	param.offDataCallback = this.offDataCallback.bind(this);
// 	param.onDataCallback = this.onDataCallback.bind(this);
	
// 	this.edge.open(param, function(error, result) {
// 		if(error)throw error;
// 		callback(result);
// 	});
// };

// 同步方式调用edgejs
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
	if(msg == 'gtskkwangluoyichang')
	{
		logger.errorlogger.error('连接读写器失败，退出重新连接');	
		process.exit(2);
	}

	logger.debuglogger.debug(msg);
};

// 离架数据
RfidNodejs.prototype.offDataCallback = function(input) 
{
	this.emit('offDataGet', input);
};

// 在架数据
RfidNodejs.prototype.onDataCallback = function(input)
{
	this.emit('onDataGet', input);
}

module.exports = RfidNodejs;