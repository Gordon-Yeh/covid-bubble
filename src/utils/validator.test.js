'use strict';

const validator = require('./validator');
const assert = require('assert');

describe('util/validator', function() {
  describe('#sanitize', function() {
    it('should escape a string', function() {
      assert.equal(validator.sanitize('<html>'), '&lt;html&gt;');
    });
  
    it('should escape >, <, &, \', \", / recursively', function() {
      const test = {
        a: '<html>',
        b: { c: '<>&\'hello\"/' },
        d: [ '<', '>', '&', '"', '/', '\'', 'valid'],
        e: 'another valid'
      }
      const expect = {
        a: '&lt;html&gt;',
        b: { c: '&lt;&gt;&amp;&#x27;hello&quot;&#x2F;' },
        d: [ '&lt;', '&gt;', '&amp;', '&quot;', '&#x2F;', '&#x27;', 'valid'],
        e: 'another valid'
      }
      let actual = validator.sanitize(test);
      assert.deepEqual(actual, expect);
    });
  });
});
