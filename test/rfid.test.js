var Rfid = require('../lib/rfid');
var should = require('should');

describe('tests/rfid.test.js', function(){
	it('应该返回布尔类型的值', function(){
		var r = new Rfid();
		var param = {
			// host: ips[i],
			host: 'COM3',
			port: 9761,
			antInfos: [
				{
					antIndex: 3,
					antPower: 27
				}
			]
		};
		r.open(param).should.be.a.boolean;
	});
	it('应该返回布尔类型的值', function(){
		var r = new Rfid();
		r.close().should.be.a.boolean;
	});
});