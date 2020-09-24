'use strict';
const sinon = require('sinon');
const { handler } = require('./userSignup');
const user = require('../controllers/user');
const assert = require('assert');
const validation = require('../middleware/bodyValidator');
const session = require('../middleware/session');
const { ValidationError, DBError } = require('../utils/error');

describe('handlers/userSignup', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('#handler()', function() {
    it('should call validation -> controller with event.body content', async function() {
      let stub = sinon.stub(user, 'createUser').resolves({ userId: 'test_userid', username: 'test_username' });
      let sStub = sinon.stub(session, 'create').resolves('test token');
      let valStub = sinon.stub(validation, 'userSignup').returns({
          email: 'test_email',
          password: 'test_password',
          firstName: 'test_firstName',
          lastName: 'test_lastName'
      });
      await handler({ body: 'test_body' });
      sinon.assert.calledOnceWithExactly(valStub, 'test_body');
      sinon.assert.calledOnceWithExactly(stub, 'test_email', 'test_password', 'test_firstName', 'test_lastName');
      sinon.assert.calledOnceWithExactly(sStub, { userId: 'test_userid', username: 'test_username' });
    });

    it('should return status 200 and controller result, if validation and controller succeeds', async function() {
      sinon.stub(user, 'createUser').resolves({ userId: 'test_userid', username: 'test_username' });
      sinon.stub(session, 'create').resolves('test token');
      sinon.stub(validation, 'userSignup').returns({
        email: 'test_email',
        password: 'test_password',
        firstName: 'test_firstName',
        lastName: 'test_lastName'
      });
      let res = await handler({ body: {} });
      assert.equal(res.statusCode, 200);
      assert.deepEqual(JSON.parse(res.body), { token: 'test token' });
    });

    it('should return status 500 and internal server error if controller fails', async function() {
      sinon.stub(user, 'createUser').rejects(DBError('internal_server_error'));
      sinon.stub(validation, 'userSignup').returns({
        email: 'test_email',
        password: 'test_password',
        firstName: 'test_firstName',
        lastName: 'test_lastName'
      });
      let res = await handler({ body: {} });
      assert.equal(res.statusCode, 500);
      assert.equal(JSON.parse(res.body).message, 'internal_server_error');
    });

    it('should return status 400 and error message if validation fails', async function() {
      sinon.stub(user, 'createUser').resolves();
      sinon.stub(validation, 'userSignup').throws(ValidationError('test error'))
      let res = await handler({ body: {} });
      assert.equal(res.statusCode, 400);
      assert.equal(JSON.parse(res.body).message, 'test error');
    });
  });
});
