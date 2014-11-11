var defines = require('./define.js').defines;

function Config(){
	/*组数据
	 * offline_max_time:   离架最大时间 [默认配置，在config.ini]
     * online_max_time:    在架最大时间
     * online_min_times:   在架最小次数
     * workline_min_time:  临架最小时间
     * workline_stop_time: 临架停留时间
     * workline_times:     临架停留时间
     * workline_max_time:  临架最大时间
     * workline_max_time:  临架次数,不用
     */
	this.groups = [
		{
			id: 0,
			name: 'group0',
			desp: '',
			groupId: 0,
			offline_max_time: 0,
			online_max_time: 0,
			online_min_time: 0,
			workline_min_time: 1.5,
			workline_stop_time: 0,
			workline_time: 0,
			workline_max_time: 0
		},
		{
			id: 1,
			name: 'group1',
			desp: '',
			groupId: 1,
			offline_max_time: 0,
			online_max_time: 0,
			online_min_time: 0,
			workline_min_time: 0.89,
			workline_stop_time: 0,
			workline_time: 0,
			workline_max_time: 0
		},
		{
			id: 2,
			name: 'group2',
			desp: '',
			groupId: 2,
			offline_max_time: 0,
			online_max_time: 0,
			online_min_time: 10,
			workline_min_time: 0,
			workline_stop_time: 0,
			workline_time: 0,
			workline_max_time: 0
		},
		{
			id: 3,
			name: 'group3',
			desp: '',
			groupId: 3,
			offline_max_time: 0,
			online_max_time: 0,
			online_min_time: 10,
			workline_min_time: 0,
			workline_stop_time: 0,
			workline_time: 0,
			workline_max_time: 0
		},
		{
			id: 4,
			name: 'group4',
			desp: '',
			groupId: 4,
			offline_max_time: 0,
			online_max_time: 0,
			online_min_time: 10,
			workline_min_time: 0,
			workline_stop_time: 0,
			workline_time: 0,
			workline_max_time: 0
		},
		{
			id: 5,
			name: 'group5',
			desp: '',
			groupId: 5,
			offline_max_time: 0,
			online_max_time: 0,
			online_min_time: 10,
			workline_min_time: 0,
			workline_stop_time: 0,
			workline_time: 0,
			workline_max_time: 0
		},
		{
			id: 6,
			name: 'group6',
			desp: '',
			groupId: 6,
			offline_max_time: 0,
			online_max_time: 0,
			online_min_time: 10,
			workline_min_time: 0,
			workline_stop_time: 0,
			workline_time: 0,
			workline_max_time: 0
		},
		{
			id: 7,
			name: 'group7',
			desp: '',
			groupId: 7,
			offline_max_time: 0,
			online_max_time: 0,
			online_min_time: 10,
			workline_min_time: 0,
			workline_stop_time: 0,
			workline_time: 0,
			workline_max_time: 0
		},
		{
			id: 8,
			name: 'group8',
			desp: '',
			groupId: 8,
			offline_max_time: 0,
			online_max_time: 0,
			online_min_time: 5,
			workline_min_time: 0,
			workline_stop_time: 0,
			workline_time: 0,
			workline_max_time: 0
		},
		{
			id: 9,
			name: 'group9',
			desp: '',
			groupId: 9,
			offline_max_time: 0,
			online_max_time: 0,
			online_min_time: 10,
			workline_min_time: 0,
			workline_stop_time: 0,
			workline_time: 0,
			workline_max_time: 0
		},
		{
			id: 10,
			name: 'group10',
			desp: '',
			groupId: 10,
			offline_max_time: 0,
			online_max_time: 0,
			online_min_time: 0,
			workline_min_time: 0,
			workline_stop_time: 0,
			workline_time: 0,
			workline_max_time: 0
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
			readerIp: '172.16.13.174',
			desp: '',
			nLevel1: 0,
			nLevel2: 0,
			nLevel3: 0,
			nLevel4: 0
		}/*,
		{
			id: 2,
			readerId: 2,
			readerIp: '172.16.13.227',
			desp: '',
			nLevel1: 0,
			nLevel2: 0,
			nLevel3: 0,
			nLevel4: 0
		},
		{
			id: 3,
			readerId: 3,
			readerIp: '172.16.13.228',
			desp: '',
			nLevel1: 0,
			nLevel2: 0,
			nLevel3: 0,
			nLevel4: 0
		},
		{
			id: 4,
			readerId: 4,
			readerIp: '172.16.13.229',
			desp: '',
			nLevel1: 0,
			nLevel2: 0,
			nLevel3: 0,
			nLevel4: 0
		}*/
	],
	/*
	 * 读写器天线数据
	 * groupId: 组ID
	 * readerId: 读写器ID
	 * antId: 天线ID(0-3)
	 */
	this.ants = [
		{
			id: 1,
			antId: 0,
			readerId: 1,
			groupId: 8,
			desp: '',
			nPower: 0,
			bEnable: true,
			nDwellTime: 0,
			nInvCycle: 0
		},
		{
			id: 2,
			antId: 1,
			readerId: 1,
			groupId: 8,
			desp: '',
			nPower: 0,
			bEnable: true,
			nDwellTime: 0,
			nInvCycle: 0
		},
		{
			id: 3,
			antId: 2,
			readerId: 1,
			groupId: 8,
			desp: '',
			nPower: 0,
			bEnable: true,
			nDwellTime: 0,
			nInvCycle: 0
		},
		{
			id: 4,
			antId: 3,
			readerId: 1,
			groupId: 8,
			desp: '',
			nPower: 0,
			bEnable: true,
			nDwellTime: 0,
			nInvCycle: 0
		},
		{
			id: 5,
			antId: 0,
			readerId: 2,
			groupId: 8,
			desp: '',
			nPower: 0,
			bEnable: true,
			nDwellTime: 0,
			nInvCycle: 0
		},
		{
			id: 6,
			antId: 1,
			readerId: 2,
			groupId: 8,
			desp: '',
			nPower: 0,
			bEnable: true,
			nDwellTime: 0,
			nInvCycle: 0
		},
		{
			id: 7,
			antId: 2,
			readerId: 2,
			groupId: 8,
			desp: '',
			nPower: 0,
			bEnable: true,
			nDwellTime: 0,
			nInvCycle: 0
		},
		{
			id: 8,
			antId: 3,
			readerId: 2,
			groupId: 8,
			desp: '',
			nPower: 0,
			bEnable: true,
			nDwellTime: 0,
			nInvCycle: 0
		}
	]

	this.groupsInfo = {};
	this.getGroupsInfo = getGroupsInfo;
	// 获得组信息
	function getGroupsInfo(){
		var m = 0;
		for (var i = 0; i < this.groups.length; i++) {
			var group = this.groups[i];
			var groupId = group.groupId;
			this.groupsInfo[groupId] = [];
			for (var j = 0; j < this.ants.length; j++) {
				var ant = this.ants[j];
				if(group.groupId == ant.groupId){
					for (var k = 0; k < this.readers.length; k++) {
						var reader = this.readers[k];
						if (reader['readerId'] == ant['readerId']) {
							var info = {
								antId: ant['antId'],
								readerIp: reader['readerIp']
							};
							this.groupsInfo[groupId].push(info);
						}
					}
				}
			}

			if(group.offline_max_time == 0){
				group.offline_max_time = defines.TAG_OFFLINE_MAX_TIME
			}

			if(group.online_max_time == 0){
				group.online_max_time = defines.TAG_ONLINE_MAX_TIME
			}

            if(group.online_min_time == 0){
            	group.online_min_time = defines.TAG_ONLINE_MIN_TIMES
            }

            if(group.workline_min_time == 0){
                group.workline_min_time = defines.TAG_WORKLINE_MIN_TIME
            }

            if(group.workline_max_time == 0){
                group.workline_max_time = defines.TAG_WORKLINE_MAX_TIME
            }

            if(group.workline_time == 0){
                group.workline_time = defines.TAG_WORKLINE_TIMES
            }

            if(group.workline_stop_time == 0){
                group.workline_stop_time = defines.TAG_WORKLINE_STOP_TIME
            }

            this.groups[m] = group;
            m++;
		}
	}


	// 获取组配置
	this.getGroupsConfig = getGroupsConfig;
	function getGroupsConfig (id) {
		if(id != undefined){
			for (var i = 0; i < this.groups.length; i++) {
				var group = this.groups[i];
				if (parseInt(group.groupId) == parseInt(id)) {
					return group;
				}
			}
		}
		return null;
	}


	// 获取读写器IP地址
	this.getReaderIps = getReaderIps;
	function getReaderIps() {
		var readerIps = [];
		for (var i = 0; i < this.readers.length; i++) {
			var reader = this.readers[i];
			readerIps.push(reader.readerIp);
		}
		return readerIps;
	}


	// 获取读写器配置
	this.getReaderConfig = getReaderConfig;
	function getReaderConfig () {
		var readers = {};
		for (var i = 0; i < this.readers.length; i++) {
			var reader = this.readers[i];
			readers[reader.readerIp] = {
				nLevel1: reader.nLevel1,
				nLevel2: reader.nLevel2,
				nLevel3: reader.nLevel3,
				nLevel4: reader.nLevel4,
				ants: []
			};

			for (var j = 0; j < this.ants.length; j++) {
				var ant = this.ants[j];
				if(ant.readerId == reader.readerId){
					readers[reader.readerIp].ants.push({
						ant: ant.antId,
						nPower: ant.nPower,
						bEnable: ant.bEnable,
						nDwellTime: ant.nDwellTime,
						nInvCycle: ant.nInvCycle
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