'use strict';
const sinon = require('sinon');
const { handler } = require('./login');
const user = require('../controllers/user');
const conn = require('../controllers/connection');
const assert = require('assert');
const validation = require('../middleware/bodyValidator');
const session = require('../middleware/session');
const { ValidationError } = require('../utils/error');

describe('handlers/login', function() {
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
  });
});
