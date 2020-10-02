'use strict';

const sinon = require('sinon');
const assert = require('assert');
const session = require('./session');
const jwt = require('jsonwebtoken');

describe('util/session', async function() {
  describe('#verify()', function() {
    it('should verify a token in the event headers', async function() {
      process.env.SESSION_KEY = 'test key';
      process.env.SESSION_EXPIRY = '2h';
      let payload = {
        userId: 'main_userid',
        username: 'main_username'
      };
      let token = await session.create(payload);
      let headers = { Cookie: `cobu_sessionToken=${token};` };
      try {
        let results = await session.verify({ headers });
        assert.strictEqual(results.userId, 'main_userid');
        assert.strictEqual(results.username, 'main_username');
      } catch (e) {
        console.log(e);
        assert(false, 'verification of token failed');
      }
    });

    it('should fail expired tokens', async function() {
      sinon.spy(jwt, 'verify');
      process.env.SESSION_KEY = 'test key';
      process.env.SESSION_EXPIRY = '1s';
      let payload = {
        userId: 'main_userid',
        username: 'main_username'
      };
      let token = await session.create(payload);
      let headers = { Cookie: `cobu_sessionToken=${token};` };
      try {
        let results = await session.verify({ headers });
        assert.strictEqual(jwt.verify.firstCall.args[0], token);
        assert.strictEqual(jwt.verify.firstCall.args[1], 'test key');
        assert.strictEqual(results.userId, 'main_userid');
        assert.strictEqual(results.username, 'main_username');
      } catch (e) {
        console.log(e);
        assert(false, 'verification of token failed');
      }

      await new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            await session.verify({ headers });
            reject(new Error());
          } catch (e) {
            console.log('failed');
            assert(e.name, 'unauthentication');
            assert(e.message, 'invalid_session');
            resolve();
          }
        }, 1000);
      })
    });
  });

  describe('#create()', function() {
    it('should call jwt.sign with the correct arguments and return a valid token', async function() {
      sinon.spy(jwt, 'sign');
      process.env.SESSION_KEY = 'test key';
      process.env.SESSION_EXPIRY = '2h';
      let payload = {
        userId: 'main_userid',
        username: 'main_username'
      };
      let result = await session.create(payload);
      jwt.verify(result, 'test key', (err, actualPl) => {
        if (err)
          assert(false, 'jwt failed to verify');
        assert(jwt.sign.calledOnce);
        assert.deepStrictEqual(jwt.sign.firstCall.args[0], payload);
        assert.strictEqual(jwt.sign.firstCall.args[1], 'test key');
        assert.deepStrictEqual(jwt.sign.firstCall.args[2], { expiresIn: '2h' });
        assert.strictEqual(actualPl.userId, 'main_userid');
        assert.strictEqual(actualPl.username, 'main_username');
      });
    });
  });
});
