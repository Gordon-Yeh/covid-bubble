'use strict';
const sinon = require('sinon');
const { handler } = require('./userSignup');
const user = require('../controllers/user');
const assert = require('assert');

describe('handlers/userSignup', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('#handler()', function() {
    it('should call controller/user.createUser() with event.body content', async function () {
      let stub = sinon.stub(user, 'createUser').resolves('success');
      let body = {
        email: 'test_email',
        password: 'test_password',
        firstName: 'test_firstName',
        lastName: 'test_lastName'
      };
      await handler({ body: JSON.stringify(body) });
      sinon.assert.calledOnceWithExactly(stub, 'test_email', 'test_password', 'test_firstName', 'test_lastName');
    });

    it('should return status 200 and controller result, when controller/user.createUser() succeeds', async function () {
      sinon.stub(user, 'createUser').resolves('success');
      let body = {
        email: 'test_email',
        password: 'test_password',
        firstName: 'test_firstName',
        lastName: 'test_lastName'
      };
      let res = await handler({ body: JSON.stringify(body) });
      assert.equal(res.statusCode, 200);
      assert.deepEqual(JSON.parse(res.body), { user: 'success' });
    });

    it('should return status 500 and internal server error if controller/user.createUser() fails', async function () {
      sinon.stub(user, 'createUser').rejects();
      let body = {
        email: 'test_email',
        password: 'test_password',
        firstName: 'test_firstName',
        lastName: 'test_lastName'
      };
      let res = await handler({ body: JSON.stringify(body) });
      assert.equal(res.statusCode, 500);
      assert.equal(res.message, 'internal_server_error');
    });
  });
});
