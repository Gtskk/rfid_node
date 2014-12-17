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

	/**
	 * 通过websocke连接 

	 	var xml = '<?xml version="1.0"?>\n<!DOCTYPE cross-domain-policy SYSTEM \n"http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">\n<cross-domain-policy>\n';
	    xml += '<site-control permitted-cross-domain-policies="master-only"/>\n';
	    xml += '<allow-access-from domain="*" to-ports="*"/>\n';
	    xml += '</cross-domain-policy>\n';

		logger.infologger.info('远程主机%s连接成功', conn.remoteAddress);

	    conn.write(xml+'\0');

		conn.on('data', function(data)
		{
			if(data == '<policy-file-request/>\0')
		      	conn.write(xml+'\0');
		    else
		    {
		    	logger.infologger.info(data.toString()+'in '+__filename);
		    	data = data.replace('\0', '');
				var ret = service.process(data.toString());
				logger.infologger.info(ret);
				conn.write(ret+"\0");
		    }
		});
		conn.on('end', function()
		{
			logger.infologger.info('Socket服务断开');
			conn.end();
		});
	 */
	var xml = '<?xml version="1.0"?>\n<!DOCTYPE cross-domain-policy SYSTEM \n"http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">\n<cross-domain-policy>\n';
	    xml += '<site-control permitted-cross-domain-policies="master-only"/>\n';
	    xml += '<allow-access-from domain="*" to-ports="*"/>\n';
	    xml += '</cross-domain-policy>\n';

	// 建立socket服务端
	net.createServer(function(conn)
	{
		conn.setEncoding("utf8");
		/*logger.infologger.info('远程主机%s连接成功', conn.remoteAddress);
		conn.on('data', function(data)
		{
			logger.infologger.info(data.toString()+'in '+__filename);
			var ret = service.process(data.toString());
			logger.infologger.info(ret);
			conn.write(ret+"\n");
		});
		conn.on('end', function()
		{
			logger.infologger.info('Socket服务断开');
			conn.end();
		});*/


		logger.infologger.info('远程主机%s连接成功', conn.remoteAddress);

	    conn.write(xml+'\0');

		conn.on('data', function(data)
		{
			if(data == '<policy-file-request/>\0')
		      	conn.write(xml+'\0');
		    else
		    {
		    	logger.infologger.info(data.toString()+'in '+__filename);
		    	data = data.replace('\0', '');
				var ret = service.process(data.toString());
				logger.infologger.info(ret);
				conn.write(ret+"\0");
		    }
		});
		conn.on('end', function()
		{
			logger.infologger.info('Socket服务断开');
			conn.end();
		});

	}).listen(port, host, function()
	{
		logger.infologger.info('Socket创建成功在%s:%d', host, port);
	});
}

main();