var net = require('net'),
	fs = require('fs');
var service = require('./service.js'),
	defines = require('./define.js').defines;

function main(){
	// 读取配置文件
	var host = defines.SOCKET_HOST || '127.0.0.1',
		port = defines.SOCKET_PORT || 80;
	// 建立socket服务端
	net.createServer(function(conn){
		console.log('Socket在%s:%d连接成功', host, port);
		conn.on('data', function(data){
			var ret = service.process(data.toString());
			conn.write(ret);
		});
		conn.on('end', function(){
			console.log('Socket服务断开');
		});
	}).listen(port, host, function(){
		console.log('Socket创建成功在%s:%d', host, port);
	});
}

main();