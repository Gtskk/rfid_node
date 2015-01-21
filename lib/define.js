/*
 * 系统常量
 */

var path = require('path'),
 	fs = require('fs');

function Defines()
{
	// 常量定义
    this.IDF_CLIENT_CODE_SUCCESS = 100  // 连接正常
    this.IDF_CLIENT_CODE_ANTENNA_EXCEPTION = 101  // 天线异常
    this.IDF_CLIENT_CODE_KEY_EXCEPTION = 102  // 密钥异常
    this.IDF_CLIENT_CODE_PRODUCT_EXCEPTION = 103  // 产品异常
    this.IDF_CLIENT_CODE_NETWORK_EXCEPTION = 104  // 网络异常
    this.IDF_CLIENT_CODE_NETWORK_TIMEOUT_EXCEPTION = 105  // 网络超时异常
    this.IDF_CLIENT_COMMAND_GETTAGSLIST = 'GetTagsList'
    this.IDF_CLIENT_COMMAND_SETTING = 'Setting'
    this.IDF_SOCKET_BUFFER = 4096
    this.REDIS_GROUP_KEY = 'GroupIDs'
    this.REDIS_DEVICE_KEY = 'DeviceIDs'
    this.REDIS_IP_STATE_KEY = 'IPSTATE'
    this.COMMANDTYPE_STATE_ON_PARAM = 'ShelfOn'  // 请求参数State:  在架
    this.COMMANDTYPE_STATE_WORK_PARAM = 'ShelfNear'  // 请求参数State:  临架
    this.COMMANDTYPE_STATE_OFF_PARAM = 'ShelfOut'  // 请求参数State:  离架
    this.COMMANDTYPE_STATE_ON_WORK_PARAM = 'ShelfOnAndNear'  // 请求参数State 在架临架
    this.CACHE_PATH = path.join(__dirname, 'yohuos') // 数据存放路径
    this.YOHO_URL = "http://api.open.yohobuy.com/?open_key=123554545&method=cnstore.product.info&v=1&sku="  // 有货商品信息接口

    this.loadConfig = loadConfig;
    function loadConfig()
    {
    	// 读取配置文件
    	var configfile = path.join(__dirname, '../config.json');
		var config = JSON.parse(fs.readFileSync(configfile, 'utf-8'));

		this.REDIS_HOST = config.redis.host  // redis连接主机
        this.REDIS_PORT = parseInt(config.redis.port)  // redis连接端口号
        this.REDIS_DB = parseInt(config.redis.db)  // redis连接数据库
        this.SOCKET_HOST = config.socket.host  // socket连接主机
        this.SOCKET_PORT = parseInt(config.socket.port)  // socket连接端口号
        this.SOCKET_KEY = config.socket.key  // socket连接key
        this.WEB_FLAG = config.webFlag; // 所连接的客户端是web的还是falsh的
    }
}

var defines = new Defines();
defines.loadConfig();

exports.defines = defines;