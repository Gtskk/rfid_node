function Config()
{
    /**
     * 组数据
     */
	/*this.groups = [
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
	];*/
	/**
	 * 读写器数据
	 * readerIp: 读写器IP地址
	 * rssi: 读写器RSSI限定值
	 * frequency: 读写器定频设置
	 */
	this.readers = [
		/*{
			id: 1,
			readerId: 1,
			readerIp: '172.16.13.5',
			rssi: -60,
			frequency: 912.75,
			stay_time: 200,
			inventory_time: 500
		},
		{
			id: 2,
			readerId: 2,
			readerIp: '172.16.13.82',
			rssi: -60,
			frequency: 922.75,
			stay_time: 200,
			inventory_time: 500
		},
		{
			id: 3,
			readerId: 3,
			readerIp: '172.16.13.83',
			rssi: -60,
			frequency: 917.75,
			stay_time: 200,
			inventory_time: 500
		},
		{
			id: 4,
			readerId: 4,
			readerIp: '172.16.13.84',
			rssi: -60,
			frequency: 922.75,
			stay_time: 200,
			inventory_time: 500
		},*/
		{
			id: 5,
			readerId: 5,
			readerIp: '172.16.13.86',
			rssi: -75,
			frequency: 924.75,
			stay_time: 100,
			inventory_time: 500
		}/*,
		{
			id: 6,
			readerId: 6,
			readerIp: '172.16.13.87',
			rssi: -65,
			frequency: 925.75,
			stay_time: 100,
			inventory_time: 500
		},
		{
			id: 7,
			readerId: 7,
			readerIp: '172.16.13.88',
			rssi: -65,
			frequency: 924.75,
			stay_time: 100,
			inventory_time: 500
		},
		{
			id: 8,
			readerId: 8,
			readerIp: '172.16.13.89',
			rssi: -60,
			frequency: 922.75,
			stay_time: 200,
			inventory_time: 500
		},
		{
			id: 9,
			readerId: 9,
			readerIp: '172.16.13.90',
			rssi: -60,
			frequency: 924.75,
			stay_time: 100,
			inventory_time: 500
		},
		{
			id: 10,
			readerId: 10,
			readerIp: '172.16.13.91',
			rssi: -60,
			frequency: 923.25,
			stay_time: 200,
			inventory_time: 500
		},
		{
			id: 11,
			readerId: 11,
			readerIp: '172.16.13.92',
			rssi: -60,
			frequency: 923.75,
			stay_time: 100,
			inventory_time: 500
		}*/
	];
	/**
	 * 读写器天线数据
	 * groupId: 组ID
	 * readerId: 读写器ID
	 * antId: 天线ID(0-3)
	 * nPower: 天线功率
	 */
	this.ants = [
		{
			id: 1,
			antId: 0,
			readerId: 1,
			groupId: 1,
			nPower: 16
		},
		{
			id: 2,
			antId: 3,
			readerId: 1,
			groupId: 1,
			nPower: 16
		},
		{
			id: 3,
			antId: 0,
			readerId: 2,
			groupId: 2,
			nPower: 16
		},
		{
			id: 4,
			antId: 3,
			readerId: 2,
			groupId: 2,
			nPower: 16
		},
		{
			id: 5,
			antId: 0,
			readerId: 3,
			groupId: 3,
			nPower: 17
		},
		{
			id: 6,
			antId: 3,
			readerId: 3,
			groupId: 3,
			nPower: 18
		},
		{
			id: 7,
			antId: 0,
			readerId: 4,
			groupId: 4,
			nPower: 18
		},
		{
			id: 8,
			antId: 3,
			readerId: 4,
			groupId: 4,
			nPower: 18
		},
		{
			id: 9,
			antId: 0,
			readerId: 5,
			groupId: 5,
			nPower: 14
		},
		{
			id: 10,
			antId: 1,
			readerId: 5,
			groupId: 5,
			nPower: 14
		},
		{
			id: 11,
			antId: 2,
			readerId: 5,
			groupId: 5,
			nPower: 14
		},
		{
			id: 12,
			antId: 3,
			readerId: 5,
			groupId: 5,
			nPower: 14
		},
		{
			id: 13,
			antId: 0,
			readerId: 6,
			groupId: 6,
			nPower: 14
		},
		{
			id: 14,
			antId: 1,
			readerId: 6,
			groupId: 6,
			nPower: 14
		},
		{
			id: 15,
			antId: 2,
			readerId: 6,
			groupId: 6,
			nPower: 14
		},
		{
			id: 16,
			antId: 3,
			readerId: 6,
			groupId: 6,
			nPower: 14
		},
		{
			id: 17,
			antId: 0,
			readerId: 7,
			groupId: 6,
			nPower: 14
		},
		{
			id: 18,
			antId: 3,
			readerId: 7,
			groupId: 6,
			nPower: 14
		},
		{
			id: 19,
			antId: 0,
			readerId: 8,
			groupId: 7,
			nPower: 15
		},
		{
			id: 20,
			antId: 3,
			readerId: 8,
			groupId: 7,
			nPower: 15
		},
		{
			id: 21,
			antId: 0,
			readerId: 9,
			groupId: 7,
			nPower: 15
		},
		{
			id: 22,
			antId: 1,
			readerId: 9,
			groupId: 7,
			nPower: 15
		},
		{
			id: 23,
			antId: 2,
			readerId: 9,
			groupId: 7,
			nPower: 15
		},
		{
			id: 24,
			antId: 3,
			readerId: 9,
			groupId: 7,
			nPower: 15
		},
		{
			id: 25,
			antId: 0,
			readerId: 10,
			groupId: 8,
			nPower: 15
		},
		{
			id: 26,
			antId: 3,
			readerId: 10,
			groupId: 8,
			nPower: 15
		},
		{
			id: 27,
			antId: 0,
			readerId: 11,
			groupId: 8,
			nPower: 15
		},
		{
			id: 28,
			antId: 1,
			readerId: 11,
			groupId: 8,
			nPower: 15
		},
		{
			id: 29,
			antId: 2,
			readerId: 11,
			groupId: 8,
			nPower: 15
		},
		{
			id: 30,
			antId: 3,
			readerId: 11,
			groupId: 8,
			nPower: 15
		}
	];

    /*this.groupsInfo = {};

    // 获得组信息
	this.getGroupsInfo = function()
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

			if(!this.groupsInfo[groupId].length)
			{
				delete this.groupsInfo[groupId];
			}

            this.groups[m] = group;
            m++;
		}
	};*/

	// 获取读写器配置
	this.getReaderConfig = function()
	{
		var readers = {};
		for (var i = 0; i < this.readers.length; i++) 
		{
			var reader = this.readers[i];
			readers[reader.readerIp] = {
				rssi: reader.rssi,
				frequency: reader.frequency,
				stay_time: reader.stay_time,
				inventory_time: reader.inventory_time,
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
					readers[reader.readerIp].group = ant.groupId;
				}
			}
			if(!readers[reader.readerIp].ants.length)
				delete readers[reader.readerIp];
		}
		return readers;
	};
}


var config = new Config();
//config.getGroupsInfo();
module.exports = config;