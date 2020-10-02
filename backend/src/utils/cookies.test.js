'use strict';

const sinon = require('sinon');
const assert = require('assert');
const cookies = require('./cookies');

describe('utils/cookies', function() {
  describe('#stringify()', function() {
    it('should return proper cookie format', () => {
      const fixed = new Date('Wed, 14 Jun 2017 07:00:00 GMT');
      sinon.stub(Date, 'now').returns(fixed.valueOf());
      let threeDays = 3*24*60*60*1000;
      let result = cookies.stringify('id', 'a3fWa', threeDays);
      assert.strictEqual(result, 'id=a3fWa; Expires=Sat, 17 Jun 2017 07:00:00 GMT; Secure; HttpOnly');
    });
  });

  describe('#parse()', function() {
    it('should parse cookies string into object key value pairs', () => {
      let test = 'a=Albert; b=Bob; c=Charlie';
      let result = cookies.parse(test);
      assert.deepStrictEqual(result, {
        a: 'Albert', b: 'Bob', c: 'Charlie'
      });
    });
  });
});
