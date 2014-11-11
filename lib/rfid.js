var edge = require('edge'), 
	path = require('path'),
	redis = require('redis'),
	events = require('events'),
	util = require('util');

var config = require('../config.js').config;
var ips = config.getReaderIps();

var r = redis.createClient();


function RfidNodejs() {
	events.EventEmitter.call(this);

	// 去除warning: possible EventEmitter memory leak detected. 11 listeners added.警告
	this.setMaxListeners(0);

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

function cloneObj(oldObj) { //复制对象方法
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

RfidNodejs.prototype.open = function(param) {
	var temp = cloneObj(param); //调用复制对象方法
	var two = {
		logCallback: this.logCallback.bind(this),
		dataCallback: this.dataCallback.bind(this)
	};
	for(var i = 0; i < 2; i++) {
		for(var j in two){
			temp[j] = two[j];
		}	
	}
	return this.edge.open(temp, true);
};

RfidNodejs.prototype.close = function() {
	return this.edge.close("", true);
};

RfidNodejs.prototype.logCallback = function(msg) {
	console.log('[RfidNodejs]', msg);
};

RfidNodejs.prototype.dataCallback = function(input, callback) {
	this.emit('dataGet', input);
};

module.exports = RfidNodejs;

if(require.main == module){
	function main() {
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
			var rfid = new RfidNodejs();

			if(rfid.open(param)) {
				console.log("rfid Opened");
				rfid.on('dataGet', function(datas){
					console.log(datas);
				});
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

	main();
}