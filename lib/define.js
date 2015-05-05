/*
 * 系统常量
 */

var path = require('path'),
 	fs = require('fs');

function Defines()
{
    this.loadConfig = loadConfig;
    function loadConfig()
    {
    	// 读取配置文件
    	var configFile = path.join(__dirname, '../config.json');
		var config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));

		this.REDIS_HOST = config.redis.host;  // redis连接主机
        this.REDIS_PORT = parseInt(config.redis.port);  // redis连接端口号
        this.SOCKET_HOST = config.socket.host; // socket连接主机
        this.SOCKET_PORT = parseInt(config.socket.port);  // socket连接端口号
        this.SOCKET_KEY = config.socket.key;  // socket连接key
        this.WEB_FLAG = config.webFlag; // 所连接的客户端是web的还是flash的

        this.CLEAR_TIME = 30000; // 移出衣架的时间，单位：毫秒
    }
}

var defines = new Defines();
defines.loadConfig();

module.exports = defines;