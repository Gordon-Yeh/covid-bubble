'use strict';
const sinon = require('sinon');
const { handler } = require('./login');
const user = require('../controllers/user');
const conn = require('../controllers/connection');
const assert = require('assert');
const validation = require('../middleware/bodyValidator');
const session = require('../middleware/session');
const { ValidationError } = require('../utils/error');

describe('handlers/userSignup', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('#handler()', function() {
    it('should call validation -> controller with event.body content', async function() {
      let stub = sinon.stub(user, 'authenticate').resolves({ userId: 'test_user', username: 'test_username' });
      let cStub = sinon.stub(conn, 'getConnections').resolves('test connections');
      let sStub = sinon.stub(session, 'create').resolves('test token');
      let valStub = sinon.stub(validation, 'login').returns({
          email: 'test_email',
          password: 'test_password'
      });
      await handler({ body: 'test_body' });
      sinon.assert.calledOnceWithExactly(valStub, 'test_body');
      sinon.assert.calledOnceWithExactly(stub, 'test_email', 'test_password');
      sinon.assert.calledOnceWithExactly(cStub, 'test_user');
      sinon.assert.calledOnceWithExactly(sStub, {
        userId: 'test_user', username: 'test_username'
      });
    });

    it('should return status 200 and session token, if validation and controller succeeds', async function() {
      sinon.stub(user, 'authenticate').resolves({ userId: 'test_user', username: 'test_username' });
      sinon.stub(conn, 'getConnections').resolves('test connections');
      sinon.stub(session, 'create').resolves('test token');
      sinon.stub(validation, 'login').returns({
        email: 'test_email',
        password: 'test_password'
      });
      let res = await handler({ body: {} });
      assert.equal(res.statusCode, 200);
      assert.deepEqual(JSON.parse(res.body), {
        token: 'test token',
        user: { userId: 'test_user', username: 'test_username' },
        connections: 'test connections'
      });
    });

    it('should return status 500 and internal server error if controller fails', async function() {
      sinon.stub(user, 'authenticate').rejects();
      sinon.stub(validation, 'login').returns({
        email: 'test_email',
        password: 'test_password'
      });
      let res = await handler({ body: {} });
      assert.equal(res.statusCode, 500);
      assert.equal(JSON.parse(res.body).message, 'internal_server_error');
    });

    it('should return status 400 and error message if validation fails', async function() {
      sinon.stub(user, 'authenticate').resolves();
      sinon.stub(validation, 'login').throws(ValidationError('test error'))
      let res = await handler({ body: {} });
      assert.equal(res.statusCode, 400);
      assert.equal(JSON.parse(res.body).message, 'test error');
    });
  });
});
