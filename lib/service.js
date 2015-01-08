var redis = require('redis');
var defines = require('./define').defines;

// 引入日志记录
var logger = require('../util/logger');

var r = redis.createClient();
r.on('error', function(err)
{
	logger.errorlogger.error('Redis错误：'+err);
});

/**
 * 处理客户端传过来的数据，找到合适的指令进行处理获取返回值
 * @param {Object} data 客户端传过来的数据
 * @return {String} 返回标签列表的序列化字符串
 */
function process(data,callback)
{
	var params = getCommand(data);
	if(params.commandType == 'GetTagsList')
	{
		getTagsList(params.commandType, params.groupId, params.state, callback);
	}

	output('error', 400, []);

}

// 读取命令结果
function getCommand(data) 
{
	try
	{
		data = JSON.parse(data);
	}
	catch(er)
	{
		logger.errorlogger.error('JSON格式错误：'+er);
	}
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
            state = 'off'
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
function getTagsList(ct, groupId, state,callback)
{
	var datas = [];
	var epcs = null;
	
	r.hget(groupId, state, function(err, obj)
	{
		if (err) {logger.errorlogger.error(err);}
		epcs = obj;

		try
		{
			epcs = JSON.parse(epcs);
		}
		catch(er)
		{
			logger.errorlogger.error('JSON格式错误：'+er);
		}

		for(var tag in epcs)
		{
			// 抓取信息
			var tagData = epcs[tag];

			if(getMillTimeDiffNow(tagData.time) < 20000)
			{
				logger.infologger.info('groupId:%s ------- %s', groupId, tagData.data.EPC);
				datas.push({EPC: tagData.data.EPC, GroupID: groupId});
			}
		}
        var outputData = output(ct, 100, datas); 
        callback(outputData);
	});

	// }

	//return output(ct, 100, datas);
}

function getMillTimeDiffNow (val) {
	var begin = new Date(val);
	var end = new Date();
	return end.getTime() - begin.getTime();
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