var Rfid = require('../lib/rfid/rfid');
var should = require('should');

describe('tests/rfid.test.js', function(){
	it('应该返回真', function(){
		var r = new Rfid();
		var param = {
			host: '172.16.13.174',
			// host: 'COM3',
			port: 9761,
			antInfos: [
				{
					antIndex: 3,
					antPower: 27
				}
			]
		};
		// r.open(param).should.be.a.boolean;
		r.open(param).should.be.true;
	});
	it('应该返回布尔类型的值', function(){
		var r = new Rfid();
		r.close().should.be.a.boolean;
	});
});