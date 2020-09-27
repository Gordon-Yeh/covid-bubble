'use strict';
const sinon = require('sinon');
const { handler } = require('./addConnection');
const controller = require('../controllers/connection');
const assert = require('assert');
const validation = require('../middleware/bodyValidator');
const { ValidationError } = require('../utils/error');

describe('handlers/addConnection', function() {
  afterEach(function() {
    sinon.restore();
  });

  describe('#handler()', function() {
    it('should call validation -> controller with event.body content', async function() {
      let stub = sinon.stub(controller, 'addConnections').resolves('success');
      let valStub = sinon.stub(validation, 'addConnections').returns({
          userId: 'id_1',
          connections: 'test_connections'
      });
      await handler({ body: 'test_body' });
      sinon.assert.calledOnceWithExactly(valStub, 'test_body');
      sinon.assert.calledOnceWithExactly(stub, 'id_1', 'test_connections');
    });
  });
});
