'use strict';
const sinon = require('sinon');
const { handler } = require('./userSignup');
const user = require('../controllers/user');
const assert = require('assert');
const validation = require('../middleware/bodyValidator');
const session = require('../middleware/session');
const response = require('../utils/response');

describe('handlers/userSignup', function() {
  const data_user = {
    userId: 'test_userid', username: 'test_username',
    email: 'test@test.com', firstName: 'test_firstName', lastName: 'test_lastName',
  };
  const data_token = 'test token';
  const data_response = 'success response';
  const data_event = { body: 'test_body' };
  const data_createResult = 'user data';

  afterEach(function() {
    sinon.restore();
  });

  describe('#handler()', function() {
    it('should call (body validation) -> (user controller) -> (session create) -> (create response)', async function() {
      let stub_validation  = sinon.stub(validation, 'userSignup').returns(data_user);
      let stub_userController = sinon.stub(user, 'createUser').resolves(data_user);
      let stub_session = sinon.stub(session, 'create').resolves(data_token);
      let stub_response = sinon.stub(response, 'success').returns(data_response);
    
      let result = await handler(data_event);
      sinon.assert.calledOnceWithExactly(stub_validation, data_event.body);
      sinon.assert.calledOnceWithExactly(stub_userController,
          data_user.email, data_user.password, data_user.firstName, data_user.lastName, data_user.username);
      sinon.assert.calledOnceWithExactly(stub_session, { userId: data_user.userId, username: data_user.username });
      sinon.assert.calledOnceWithExactly(stub_response, { user: data_user }, data_token);
      assert.strictEqual(result, data_response);
    });

    it('should call errorToResponse and return the result when validation throws error', async function() {
      let stub_validation = sinon.stub(validation, 'userSignup').throws('test error');
      let stub_userController = sinon.stub(user, 'createUser').resolves(data_user);
      let stub_session = sinon.stub(session, 'create').resolves(data_token);
      let stub_response = sinon.stub(response, 'success').returns(data_response);
      let stub_errorToResponse = sinon.stub(response, 'errorToResponse').returns('error response');

      let result = await handler(data_event);
      sinon.assert.calledOnce(stub_errorToResponse);
      sinon.assert.calledOnce(stub_validation);
      sinon.assert.notCalled(stub_userController);
      sinon.assert.notCalled(stub_session);
      sinon.assert.notCalled(stub_response);
      assert.strictEqual(result, 'error response');
    });

    it('should call errorToResponse and return the result when controller throws error', async function() {
      let stub_validation = sinon.stub(validation, 'userSignup').returns(data_user);
      let stub_userController = sinon.stub(user, 'createUser').rejects('test error');
      let stub_session = sinon.stub(session, 'create').resolves(data_token);
      let stub_response = sinon.stub(response, 'success').returns(data_response);
      let stub_errorToResponse = sinon.stub(response, 'errorToResponse').returns('error response');

      let result = await handler(data_event);
      sinon.assert.calledOnce(stub_errorToResponse);
      sinon.assert.calledOnce(stub_validation);
      sinon.assert.calledOnce(stub_userController);
      sinon.assert.notCalled(stub_session);
      sinon.assert.notCalled(stub_response);
      assert.strictEqual(result, 'error response');
    });
  });
});
