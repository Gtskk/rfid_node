/**
 * 读写器数据
 *
 * @property readerId 读写器ID
 * @property readerIp 读写器IP地址
 * @property rssi 读写器RSSI限定值
 * @property frequency 读写器定频设置
 * @property stay_time 天线驻留时长
 * @property inventory_time 读写器盘点时长
 */
var readers = [
    {
        readerId: 1,
        readerIp: '172.16.13.5',
        rssi: -60,
        frequency: 912.75,
        stay_time: 200,
        inventory_time: 500
    },
    {
        readerId: 2,
        readerIp: '172.16.13.82',
        rssi: -60,
        frequency: 922.75,
        stay_time: 200,
        inventory_time: 500
    },
    {
        readerId: 3,
        readerIp: '172.16.13.83',
        rssi: -60,
        frequency: 917.75,
        stay_time: 200,
        inventory_time: 500
    },
    {
        readerId: 4,
        readerIp: '172.16.13.84',
        rssi: -60,
        frequency: 922.75,
        stay_time: 200,
        inventory_time: 500
    },
    {
        readerId: 5,
        readerIp: '172.16.13.86',
        rssi: -75,
        frequency: 924.75,
        stay_time: 100,
        inventory_time: 500
    },
    {
        readerId: 6,
        readerIp: '172.16.13.87',
        rssi: -65,
        frequency: 925.75,
        stay_time: 100,
        inventory_time: 500
    },
    {
        readerId: 7,
        readerIp: '172.16.13.88',
        rssi: -65,
        frequency: 924.75,
        stay_time: 100,
        inventory_time: 500
    },
    {
        readerId: 8,
        readerIp: '172.16.13.89',
        rssi: -60,
        frequency: 922.75,
        stay_time: 200,
        inventory_time: 500
    },
    {
        readerId: 9,
        readerIp: '172.16.13.90',
        rssi: -60,
        frequency: 924.75,
        stay_time: 100,
        inventory_time: 500
    },
    {
        readerId: 10,
        readerIp: '172.16.13.91',
        rssi: -60,
        frequency: 923.25,
        stay_time: 200,
        inventory_time: 500
    },
    {
        readerId: 11,
        readerIp: '172.16.13.92',
        rssi: -60,
        frequency: 923.75,
        stay_time: 100,
        inventory_time: 500
    }
];
/**
 * 读写器天线数据
 *
 * @property antId 天线ID（0-3）
 * @property readerId 读写器ID
 * @property groupId 组ID
 * @property nPower 天线功率
 */
var ants = [
    {
        antId: 0,
        readerId: 1,
        groupId: 1,
        nPower: 16
    },
    {
        antId: 3,
        readerId: 1,
        groupId: 1,
        nPower: 16
    },
    {
        antId: 0,
        readerId: 2,
        groupId: 2,
        nPower: 16
    },
    {
        antId: 3,
        readerId: 2,
        groupId: 2,
        nPower: 16
    },
    {
        antId: 0,
        readerId: 3,
        groupId: 3,
        nPower: 17
    },
    {
        antId: 3,
        readerId: 3,
        groupId: 3,
        nPower: 18
    },
    {
        antId: 0,
        readerId: 4,
        groupId: 4,
        nPower: 18
    },
    {
        antId: 3,
        readerId: 4,
        groupId: 4,
        nPower: 18
    },
    {
        antId: 0,
        readerId: 5,
        groupId: 5,
        nPower: 14
    },
    {
        antId: 1,
        readerId: 5,
        groupId: 5,
        nPower: 14
    },
    {
        antId: 2,
        readerId: 5,
        groupId: 5,
        nPower: 14
    },
    {
        antId: 3,
        readerId: 5,
        groupId: 5,
        nPower: 14
    },
    {
        antId: 0,
        readerId: 6,
        groupId: 6,
        nPower: 14
    },
    {
        antId: 1,
        readerId: 6,
        groupId: 6,
        nPower: 14
    },
    {
        antId: 2,
        readerId: 6,
        groupId: 6,
        nPower: 14
    },
    {
        antId: 3,
        readerId: 6,
        groupId: 6,
        nPower: 14
    },
    {
        antId: 0,
        readerId: 7,
        groupId: 6,
        nPower: 14
    },
    {
        antId: 3,
        readerId: 7,
        groupId: 6,
        nPower: 14
    },
    {
        antId: 0,
        readerId: 8,
        groupId: 7,
        nPower: 15
    },
    {
        antId: 3,
        readerId: 8,
        groupId: 7,
        nPower: 15
    },
    {
        antId: 0,
        readerId: 9,
        groupId: 7,
        nPower: 15
    },
    {
        antId: 1,
        readerId: 9,
        groupId: 7,
        nPower: 15
    },
    {
        antId: 2,
        readerId: 9,
        groupId: 7,
        nPower: 15
    },
    {
        antId: 3,
        readerId: 9,
        groupId: 7,
        nPower: 15
    },
    {
        antId: 0,
        readerId: 10,
        groupId: 8,
        nPower: 15
    },
    {
        antId: 3,
        readerId: 10,
        groupId: 8,
        nPower: 15
    },
    {
        antId: 0,
        readerId: 11,
        groupId: 8,
        nPower: 15
    },
    {
        antId: 1,
        readerId: 11,
        groupId: 8,
        nPower: 15
    },
    {
        antId: 2,
        readerId: 11,
        groupId: 8,
        nPower: 15
    },
    {
        antId: 3,
        readerId: 11,
        groupId: 8,
        nPower: 15
    }
];

/**
 * 获取读写器配置
 *
 * @returns {Object}
 */
exports.getReaderConfig = function()
{
    var readersConfig = {};
    for (var i = 0; i < readers.length; i++)
    {
        var reader = readers[i];
        readersConfig[reader.readerIp] = {
            rssi: reader.rssi,
            frequency: reader.frequency,
            stay_time: reader.stay_time,
            inventory_time: reader.inventory_time,
            ants: []
        };

        for (var j = 0; j < ants.length; j++)
        {
            var ant = ants[j];
            if(ant.readerId == reader.readerId)
            {
                readersConfig[reader.readerIp].ants.push({
                    antIndex: ant.antId,
                    antPower: ant.nPower
                });
                readersConfig[reader.readerIp].group = ant.groupId;
            }
        }
        if(!readersConfig[reader.readerIp].ants.length)
            delete readersConfig[reader.readerIp];
    }
    return readersConfig;
};