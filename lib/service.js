var redis = require('redis');
var config = require('./config.js').config;
var defines = require('./define').defines;

// 引入日志记录
var logger = require('../util/logger');

var epcs = null;

/**
 * 处理客户端传过来的数据，找到合适的指令进行处理获取返回值
 * @param {Object} data 客户端传过来的数据
 * @return {String} 返回标签列表的序列化字符串
 */
function process(data)
{
	try{
		var params = getCommand(data);
		if(params.commandType == 'GetTagsList')
		{
			return getTagsList(params.commandType, params.groupId, params.state);
		}
	}
	catch(err)
	{
		logger.errorlogger.error('错误：%s', err.message);
	}
}

// 读取命令结果
function getCommand(data) 
{
	data = JSON.parse(data);
	var params = {};

	if(data.Key != defines.SOCKET_KEY)
	{
		params.commandType = 'error';
		return params;
	}

	params.commandType = data.CommandType;
	if('GroupID' in data)
	{
		params.groupId = data.GroupID;
	}

	if('State' in data)
	{
		var state = data.State;
		if(state == 'ShelfOn')
		{
            state = 'on'
        }
        else if(state == 'ShelfOff')
        {
            state = 'work'
        }
        else if(state == 'ShelfOnAndOff')
        {
            state = 'onAndWork'
        }
        else
        {
            state = 'off'
        }
        params.state = state
	}

	return params;
}


// 获取标签列表
function getTagsList(ct, groupId, state)
{
	var r = redis.createClient();
	r.on('error', function(err) 
	{
		logger.errorlogger.error('Redis错误：'+err);
	});
	
	var states = [];
	var datas = [];
	var groupConfig = config.getGroupsConfig(groupId);
	
	if(state == 'onAndWork')
	{
		states.push('on');
		states.push('work');
	}else{
		states.push(state);
	}
	
	for (var i = 0; i < states.length; i++)
	{
		r.hget(groupId, state, function(err, obj)
		{
			if (err) {logger.errorlogger.error(err);}
			epcs = obj;
		});
		
		if(epcs == null)
			continue;
		epcs = JSON.parse(epcs);

		for(var tag in epcs)
		{
			// 抓取信息
			var tagData = epcs[tag];
			// logger.infologger.info('groupId:%s ------- %s----%s', groupId, tagData.data.EPC, tagData.time);
			logger.infologger.info('groupId:%s ------- %s', groupId, tagData.data.EPC);

			datas.push(tagData.data.EPC);
		}
	}

	return output(ct, 'success', datas);
}


function output (commandType, code, data)
{
	res = {
		CommandType: commandType,
		Code: code,
		Data: data
	};
	return JSON.stringify(res);
}

exports.process = process;