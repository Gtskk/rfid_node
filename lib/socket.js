var net = require('net');

var service = require('./service.js'),
	defines = require('./define.js').defines,
	logger = require('../util/logger');// 引入日志记录

/**
 * socket服务创建模块
 */
function main()
{
	// 读取配置文件
	var host = defines.SOCKET_HOST || '127.0.0.1',
		port = defines.SOCKET_PORT || 80;
	// 建立socket服务端
	net.createServer(function(conn)
	{
		
		logger.infologger.info('Socket在%s:%d连接成功', host, port);
		conn.on('data', function(data)
		{
			logger.infologger.info(data.toString());
			var ret = service.process(data.toString());
			conn.write(ret);
		});
		conn.on('end', function()
		{
			logger.infologger.info('Socket服务断开');
		});

	}).listen(port, host, function()
	{
		logger.infologger.info('Socket创建成功在%s:%d', host, port);
	});
}

main();