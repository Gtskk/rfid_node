var defines = require('./define').defines;

function Config()
{
	/*
	 * 组数据
     */
	this.groups = [
		{
			id: 0,
			name: 'group0',
			groupId: 0
		},
		{
			id: 1,
			name: 'group1',
			groupId: 1
		},
		{
			id: 2,
			name: 'group2',
			groupId: 2
		},
		{
			id: 3,
			name: 'group3',
			groupId: 3
		},
		{
			id: 4,
			name: 'group4',
			groupId: 4
		},
		{
			id: 5,
			name: 'group5',
			groupId: 5
		},
		{
			id: 6,
			name: 'group6',
			groupId: 6
		},
		{
			id: 7,
			name: 'group7',
			groupId: 7
		},
		{
			id: 8,
			name: 'group8',
			groupId: 8
		},
		{
			id: 9,
			name: 'group9',
			groupId: 9
		},
		{
			id: 10,
			name: 'group10',
			groupId: 10
		}
	],
	/*
	 * 读写器数据
	 *readerIp: 读写器IP地址
	 */
	this.readers = [
		{
			id: 1,
			readerId: 1,
			readerIp: '172.16.13.84',
			nLevel1: 0,
			nLevel2: 0,
			nLevel3: 0,
			nLevel4: 0
		},
		{
			id: 2,
			readerId: 2,
			readerIp: '172.16.13.85',
			nLevel1: 0,
			nLevel2: 0,
			nLevel3: 0,
			nLevel4: 0
		},
		// {
		// 	id: 3,
		// 	readerId: 3,
		// 	readerIp: '172.16.13.228',
		// 	desp: '',
		// 	nLevel1: 0,
		// 	nLevel2: 0,
		// 	nLevel3: 0,
		// 	nLevel4: 0
		// },
		// {
		// 	id: 4,
		// 	readerId: 4,
		// 	readerIp: '172.16.13.229',
		// 	desp: '',
		// 	nLevel1: 0,
		// 	nLevel2: 0,
		// 	nLevel3: 0,
		// 	nLevel4: 0
		// }
	],
	/*
	 * 读写器天线数据
	 * groupId: 组ID
	 * readerId: 读写器ID
	 * antId: 天线ID(0-3)
	 */
	this.ants = [
		/*{
			id: 1,
			antId: 0,
			readerId: 1,
			groupId: 8,
			nPower: 18
		},*/
		/*{
			id: 2,
			antId: 1,
			readerId: 1,
			groupId: 8,
			nPower: 18
		},*/
		/*{
			id: 3,
			antId: 2,
			readerId: 1,
			groupId: 8,
			nPower: 18
		},*/
		{
			id: 4,
			antId: 3,
			readerId: 1,
			groupId: 8,
			nPower: 18
		},
		/*{
			id: 5,
			antId: 0,
			readerId: 2,
			groupId: 8,
			nPower: 18
		},
		{
			id: 6,
			antId: 1,
			readerId: 2,
			groupId: 8,
			nPower: 18
		},
		{
			id: 7,
			antId: 2,
			readerId: 2,
			groupId: 8,
			nPower: 18
		},*/
		{
			id: 8,
			antId: 3,
			readerId: 2,
			groupId: 8,
			nPower: 18
		}
	]

	this.groupsInfo = {};
	this.getGroupsInfo = getGroupsInfo;
	// 获得组信息
	function getGroupsInfo()
	{
		var m = 0;
		for (var i = 0; i < this.groups.length; i++) 
		{
			var group = this.groups[i];
			var groupId = group.groupId;
			this.groupsInfo[groupId] = [];
			for (var j = 0; j < this.ants.length; j++)
			{
				var ant = this.ants[j];
				if(group.groupId == ant.groupId)
				{
					for (var k = 0; k < this.readers.length; k++) 
					{
						var reader = this.readers[k];
						if (reader['readerId'] == ant['readerId']) 
						{
							var info = {
								antId: ant['antId'],
								readerIp: reader['readerIp']
							};
							this.groupsInfo[groupId].push(info);
						}
					}
				}
			}

			if(group.offline_max_time == 0)
			{
				group.offline_max_time = defines.TAG_OFFLINE_MAX_TIME
			}

			if(group.online_max_time == 0)
			{
				group.online_max_time = defines.TAG_ONLINE_MAX_TIME
			}

            if(group.online_min_time == 0)
            {
            	group.online_min_time = defines.TAG_ONLINE_MIN_TIMES
            }

            if(group.workline_min_time == 0)
            {
                group.workline_min_time = defines.TAG_WORKLINE_MIN_TIME
            }

            if(group.workline_max_time == 0)
            {
                group.workline_max_time = defines.TAG_WORKLINE_MAX_TIME
            }

            if(group.workline_time == 0)
            {
                group.workline_time = defines.TAG_WORKLINE_TIMES
            }

            if(group.workline_stop_time == 0)
            {
                group.workline_stop_time = defines.TAG_WORKLINE_STOP_TIME
            }

            this.groups[m] = group;
            m++;
		}
	}


	// 获取组配置
	this.getGroupsConfig = getGroupsConfig;
	function getGroupsConfig (id) 
	{
		if(id != undefined)
		{
			for (var i = 0; i < this.groups.length; i++) 
			{
				var group = this.groups[i];
				if (parseInt(group.groupId) == parseInt(id)) 
				{
					return group;
				}
			}
		}
		return null;
	}


	// 获取读写器IP地址
	this.getReaderIps = getReaderIps;
	function getReaderIps() 
	{
		var readerIps = [];
		for (var i = 0; i < this.readers.length; i++) 
		{
			var reader = this.readers[i];
			readerIps.push(reader.readerIp);
		}
		return readerIps;
	}


	// 获取读写器配置
	this.getReaderConfig = getReaderConfig;
	function getReaderConfig () 
	{
		var readers = {};
		for (var i = 0; i < this.readers.length; i++) 
		{
			var reader = this.readers[i];
			readers[reader.readerIp] = {
				nLevel1: reader.nLevel1,
				nLevel2: reader.nLevel2,
				nLevel3: reader.nLevel3,
				nLevel4: reader.nLevel4,
				ants: []
			};

			for (var j = 0; j < this.ants.length; j++) 
			{
				var ant = this.ants[j];
				if(ant.readerId == reader.readerId)
				{
					readers[reader.readerIp].ants.push({
						antIndex: ant.antId,
						antPower: ant.nPower
					});
				}
			}
		}
		return readers;
	}
}


var config = new Config();
config.getGroupsInfo();
exports.config = config;