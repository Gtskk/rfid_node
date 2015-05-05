var defines = require('./define.js'),
    logger = require('../util/logger.js'),// 引入日志记录
    _ = require('lodash/collection/forEach'),
    r = require('./rfidRedis.js');// 引入redis

/**
 * 处理客户端传过来的数据，找到合适的指令进行处理获取返回值
 *
 * @param {Object} data 客户端传过来的数据
 * @return {String} 返回标签列表的序列化字符串
 */
function process(data, callback)
{
	var params = getCommand(data);
	if(params.commandType == 'GetTagsList')
	{
		getTagsList(params.commandType, params.groupId, params.state, callback);
	}

	output('error', 400, []);
}

/**
 * 读取命令结果
 *
 * @param {String} data 传入的数据
 * @returns {Object} params 解析出来的数据对象
 */
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
	}
    else
    {
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
            else
            {
                state = 'off'
            }
            params.state = state
        }
    }

	return params;
}


/**
 * 获取标签列表
 * @param {String} ct 命令类型
 * @param {Number} groupId 组ID
 * @param {String} state 所要获取的标签状态
 * @param {Function} callback 回调函数
 */
function getTagsList(ct, groupId, state,callback)
{
	var datas = [];
	r.hget(groupId, state, function(err, epcs)
	{
		if (err)
        {
            logger.errorlogger.error(err);
        }
        else
        {
            try
            {
                epcs = JSON.parse(epcs);
                _.forEach(epcs, function(tagData){
                    // 判断标签的更新时间和当前时间的时间之差，只有小于30000毫秒才判定为离架，否则判定为标签已经不存在
                    if(tagData && getMillTimeDiffNow(tagData.time) < defines.CLEAR_TIME)
                    {
                        logger.infologger.info('groupId:%s ------- %s', groupId, tagData.data.EPC);
                        datas.push({EPC: tagData.data.EPC, GroupID: groupId});
                    }
                });
            }
            catch(er)
            {
                logger.errorlogger.error('标签数据JSON格式错误：'+er);
            }
        }

		// 有离架标签则记录日志
		if(datas.length)
		{
			logger.infologger.info(datas);
		}

        var outputData = output(ct, 100, datas); 
        callback(outputData);
	});
}

/**
 * 获取指定时间和当前时间的差异
 *
 * @param {Number} val 指定的时间
 * @returns {Number} int 时间差（单位：毫秒）
 */
function getMillTimeDiffNow(val)
{
	var begin = new Date(val);
	var end = new Date();
	return end.getTime() - begin.getTime();
}


/**
 * 格式化输出内容
 * @param {String} commandType 命令类型
 * @param {Number} code 状态码
 * @param {Object} data 数据
 * @returns {String} JSON.stringify(res)
 */
function output (commandType, code, data)
{
	var res = {
		CommandType: commandType,
		Code: code,
		Data: data
	};

	return JSON.stringify(res);
}

exports.process = process;
//exports.getCommand = getCommand;