'use strict';
const sinon = require('sinon');
const { handler } = require('./login');
const user = require('../controllers/user');
const assert = require('assert');
const validation = require('../middleware/bodyValidator');
const { ValidationError } = require('../utils/error');

describe('handlers/userSignup', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('#handler()', function() {
    it('should call validation -> controller with event.body content', async function() {
      let stub = sinon.stub(user, 'login').resolves('success');
      let valStub = sinon.stub(validation, 'login').returns({
          email: 'test_email',
          password: 'test_password'
      });
      await handler({ body: 'test_body' });
      sinon.assert.calledOnceWithExactly(valStub, 'test_body');
      sinon.assert.calledOnceWithExactly(stub, 'test_email', 'test_password');
    });

    it('should return status 200 and session token, if validation and controller succeeds', async function() {
      sinon.stub(user, 'login').resolves('success');
      sinon.stub(validation, 'login').returns({
        email: 'test_email',
        password: 'test_password'
      });
      let res = await handler({ body: {} });
      assert.equal(res.statusCode, 200);
      assert.deepEqual(JSON.parse(res.body), { token: 'token' });
    });

    it('should return status 500 and internal server error if controller fails', async function() {
      sinon.stub(user, 'login').rejects();
      sinon.stub(validation, 'login').returns({
        email: 'test_email',
        password: 'test_password'
      });
      let res = await handler({ body: {} });
      assert.equal(res.statusCode, 500);
      assert.equal(res.message, 'internal_server_error');
    });

    it('should return status 400 and error message if validation fails', async function() {
      sinon.stub(user, 'login').resolves();
      sinon.stub(validation, 'login').throws(ValidationError('test error'))
      let res = await handler({ body: {} });
      assert.equal(res.statusCode, 400);
      assert.equal(res.message, 'test error');
    });
  });
});
