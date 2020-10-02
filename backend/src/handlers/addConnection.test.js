'use strict';
const sinon = require('sinon');
const { handler } = require('./addConnection');
const controller = require('../controllers/connection');
const assert = require('assert');
const validation = require('../middleware/bodyValidator');
const session = require('../middleware/session');

describe('handlers/addConnection', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('#handler()', function() {
    it('should call verify session -> validation -> controller with event.body content', async function() {
      const data_event = { body: 'test_body' };
      const data_user = { userId: 'test_user' };
      let sessionStub = sinon.stub(session, 'verify').resolves(data_user);
      let stub = sinon.stub(controller, 'addConnections').resolves('success');
      let valStub = sinon.stub(validation, 'addConnections').returns({ connections: 'test_connections' });
      await handler(data_event);
      sinon.assert.calledOnceWithExactly(sessionStub, data_event);
      sinon.assert.calledOnceWithExactly(valStub, 'test_body');
      sinon.assert.calledOnceWithExactly(stub, 'test_user', 'test_connections');
    });
  });
});
