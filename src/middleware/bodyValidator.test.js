'use strict';

const validation = require('./bodyValidator');
const assert = require('assert');

describe('util/validator', function() {
  describe('#userSignup()', function() {
    it('should take a json string for input', function() {
      let test = {
        email: 'not a real email',
        firstName: 'John',
        lastName: 'Smith',
        password: '123123123',
        username: 'johnsmith1'
      };
      try {
        validation.userSignup(JSON.stringify(test));
      } catch (e) {
        assert.equal(e.name, 'validation', e.stack);
        assert.deepEqual(JSON.parse(e.message), ['invalid_email']);
      }
    });

    it('should return invalid_body well if input is malformed', function() {
      try {
        validation.userSignup(null);
      } catch(e) {
        assert.equal(e.name, 'validation', e.stack);
        assert.deepEqual(JSON.parse(e.message), ['invalid_body']);
      }

      try {
        validation.userSignup(undefined);
      } catch(e) {
        assert.equal(e.name, 'validation', e.stack);
        assert.deepEqual(JSON.parse(e.message), ['invalid_body']);
      }

      try {
        validation.userSignup("");
      } catch(e) {
        assert.equal(e.name, 'validation', e.stack);
        assert.deepEqual(JSON.parse(e.message), ['invalid_body']);
      }
    });

    it('should throw error for invalid email', function() {
      let test = {
        email: 'not a real email',
        firstName: 'John',
        lastName: 'Smith',
        password: '123123123',
        username: 'johnsmith1'
      };
      try {
        validation.userSignup(test);
      } catch (e) {
        assert.equal(e.name, 'validation', e.stack);
        assert.deepEqual(JSON.parse(e.message), ['invalid_email']);
      }
    });

    it('should throw invalid error if fields are missing', function() {
      try {
        validation.userSignup({});
      } catch (e) {
        assert.equal(e.name, 'validation', e.stack);
        assert.deepEqual(JSON.parse(e.message), ['invalid_email', 'invalid_firstname', 'invalid_lastname', 'invalid_username', 'invalid_password']);
      }
    });
  });

  describe('#sanitize()', function() {
    it('should escape a string', function() {
      assert.equal(validation.sanitize('<html>'), '&lt;html&gt;');
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
      let actual = validation.sanitize(test);
      assert.deepEqual(actual, expect);
    });
  });
});
