var cp = require('child_process');

// 引入日志记录
var logger = require('./util/logger.js');
// 引入redis
var r = require('./lib/rfidRedis.js');

var processlists = ['./lib/socket.js', './lib/tagCheck.js'];
var processrun = [];

/**
 * 守护进程函数
 *
 * @param {string} service 服务名称
 */
function spawn(service){
	var child = cp.spawn('node', [service]);
	processrun.push(child);

	child.stdout.setEncoding('utf8');
	child.stdout.on('data', function (data) {
		console.log(data);
	});

	child.stderr.on('data', function (data) {
	    logger.errorlogger.error('子进程中存在错误，错误信息为：' + data);
	});
	
	child.on('exit', function(code){
		logger.errorlogger.error('子进程退出，状态码' + code);
        if(code == 1 || code == 2)
        {
            setTimeout(spawn(service), 5000);// 延迟5秒以便之前的资源释放
        }
        else if(code != 0)
        {
            spawn(service);
        }
	});

}

/**
 * 程序主函数
 */
function main(){

	// 清除redis内存数据库数据
	r.keys('*', function(err, keys){
		keys.forEach(function (key, pos) 
		{
            r.del(key, function(err, o) 
            {
	          	if (err) 
	          	{
                    logger.errorlogger.error('没有' + key);
	            }
	            if (pos === (keys.length - 1)) 
	            {
	            	logger.debuglogger.debug('redis内存数据清理成功');
	            }
            });
        });
        r.quit();
        r = null;
	});

	for (var i = 0; i < processlists.length; i++) {
		spawn(processlists[i]);
	}

	process.on('SIGINT', function(){
		for (var j = 0; j < processrun.length; j++) {
			processrun[j].kill();
		}
		logger.debuglogger.debug('程序退出成功');
		process.exit(0);
	});

	// 监听异常
	process.on('uncaughtException', function(er) {
		logger.errorlogger.error(er.stack);
		process.exit(1);
	});
}

main();