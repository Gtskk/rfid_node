// 监控服务，不断监听读写器状态
var redis = require('redis'),
	net = require('net');
var config = require('./config.js').config,
	defines = require('./define.js').defines;

var r = redis.createClient();
var ips = config.getReaderIps();

// 主函数
function main () {
	setInterval(function(){
		for (var i = 0; i < ips.length; i++) {
			checkStates(ips[i]);
		};
	}, 1000);
}

// 不断检查读写器的状态
function checkStates (ip) {
	var states = r.get(defines.REDIS_IP_STATE_KEY);
	if(states != true && states){
		states = JSON.parse(states);
	}else{
		states = {};
	}

	var state = 0;
	try{
		net.connect({
			host: ip,
			port: 80
		}, function(){
			state = 1;
			console.log('连接成功');
		});
	}catch(e){
		statue = 0;
		console.log(e.message);
	}
	

	if(ip in states){
		if (state == 0) {
			if(states[ip]['FailTimeStamp'] == 0){
				states[ip]['TimeLong'] = 1
			}else{
				states[ip]['TimeLong'] = new Date().getTime() - states[ip]['FailTimeStamp'];
			}
			states[ip]['FailTimeStamp'] = new Date().getTime();
		}

		states[ip]['state'] = state;
	}else{
		states[ip] = {
			state: state,
			TimeLong: 0,
			FailTimeStamp: 0
		};
	}

	r.set(defines.REDIS_IP_STATE_KEY, JSON.stringify(states));
}

main();