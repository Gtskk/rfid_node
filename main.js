var cp = require('child_process'),
	http = require('http'),
	redis = require('redis');

// 引入日志记录
var logger = require('./util/logger');

var socket = require('./lib/socket.js'),
	// monitor = require('./monitor.js'),
	// rfid = require('./lib/rfid.js'),
	tagCheck = require('./lib/tagCheck.js');

var processlists = [socket, tagCheck];
var processrun = [];

//守护进程函数
function spawn(service){
	var child = cp.spawn('node', [service]);

	processrun.push(child);

	child.on('exit', function(code){
		if(code != 0){
			spawn(service);
		}
	});
}

// 程序主函数
function main(){

	var r = redis.createClient();
	// 监听连接错误
	r.on('error', function(er)
	{
		logger.debuglogger.debug(er.stack);
	})

	// 清除redis内存数据库数据
	r.keys('*', function(err, keys){
		keys.forEach(function (key, pos) 
		{
            r.del(key, function(err, o) 
            {
	          	if (err) 
	          	{
	                return console.error('没有' + key);
	            }
	            if (pos === (keys.length - 1)) 
	            {
	                r.quit();
	                r = null;
	            }
            });
        });
        logger.infologger.info('redis内存数据清理成功');
	});

	for (var i = 0; i < processlists.length; i++) {
		spawn(processlists[i]);
	}

	process.on('SIGTERM', function(){
		for (var j = 0; j < processrun.length; j++) {
			processrun[j].kill();
		}
		process.exit(0);
	});

	// 监听异常
	process.on('uncaughtException', function(er)
	{
		logger.errorlogger.error(er.stack);
		process.exit(1);
	});
}

main();