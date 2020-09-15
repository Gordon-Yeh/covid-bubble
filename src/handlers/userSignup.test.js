'use strict';
const sinon = require('sinon');
const { handler } = require('./userSignup');
const user = require('../controllers/user');

describe('handlers/userSignup', function() {
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
  });
})