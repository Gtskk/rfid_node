var cp = require('child_process'),
	http = require('http');

var socket = require('./socket.js'),
	// monitor = require('./monitor.js'),
	// rfid = require('./lib/rfid.js'),
	tagCheck = require('./tagCheck.js');

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
function main(argv){
	for (var i = 0; i < processlists.length; i++) {
		spawn(processlists[i]);
	}

	process.on('SIGTERM', function(){
		for (var j = 0; j < processrun.length; j++) {
			processrun[j].kill();
		}
		process.exit(0);
	});
}

main(process.argv.slice(2));