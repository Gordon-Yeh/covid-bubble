'use strict';

const assert = require('assert');
const sinon = require('sinon');
const Database = require('../db');
const id = require('../utils/id');
const controller = require('./connection');

describe('controllers/node', function() {
  afterEach(function() {
    sinon.restore();
  })
  
  describe('#addConnections()',  function() {
    it('should call db query with the right arguments with adding one connection', async function() {
      let connections = [
        { name: 'test_connection_1', linkedUsername: 'test_user_1' }
      ];
      let dbQueryStub = sinon.stub(Database.prototype, 'query');
      dbQueryStub.resolves('success');
      let idStub = sinon.stub(id, 'genConnectionId').returns('test_connection_id');
      await controller.addConnections('main_user', connections);
      assert(dbQueryStub.calledOnce);
      assert(idStub.calledOnce);
      sinon.assert.calledWith(dbQueryStub, 
        'INSERT INTO Connections (connection_id, user_a, name, user_b) VALUES (?,?,?,(SELECT user_id FROM Users WHERE username=?));',
        ['test_connection_id', 'main_user', 'test_connection_1', 'test_user_1']
      );
    });

    it('should call db query with the right arguments with adding two connections', async function() {
      let connections = [
        { name: 'connection_0', linkedUsername: 'user_0' },
        { name: 'connection_1' }
      ];
      let dbQueryStub = sinon.stub(Database.prototype, 'query');
      dbQueryStub.resolves('success');
      let idStub = sinon.stub(id, 'genConnectionId');
      idStub.onCall(0).returns('id_0');
      idStub.onCall(1).returns('id_1');
      await controller.addConnections('main_user', connections);
      assert(dbQueryStub.calledOnce);
      assert(idStub.calledTwice);
      sinon.assert.calledWith(dbQueryStub, 
        'INSERT INTO Connections (connection_id, user_a, name, user_b) VALUES (?,?,?,(SELECT user_id FROM Users WHERE username=?)),(?,?,?,?);',
        [
          'id_0', 'main_user', 'connection_0', 'user_0',
          'id_1', 'main_user', 'connection_1', undefined,
        ]
      );
    });

    it('should call db query with the right arguments with adding ten connections', async function() {
      let connections = [
        { name: 'connection_0', linkedUsername: 'user_0' },
        { name: 'connection_1', linkedUsername: 'user_1' },
        { name: 'connection_2' },
        { name: 'connection_3' },
        { name: 'connection_4' },
        { name: 'connection_5', linkedUsername: 'user_5' },
        { name: 'connection_6' },
        { name: 'connection_7' },
        { name: 'connection_8' },
        { name: 'connection_9', linkedUsername: 'user_9' }
      ];
      let dbQueryStub = sinon.stub(Database.prototype, 'query');
      dbQueryStub.resolves('success');
      let idStub = sinon.stub(id, 'genConnectionId');
      for (let i = 0; i < 10; i++) {
        idStub.onCall(i).returns(`id_${i}`);
      }
      let result = await controller.addConnections('main_user', connections);
      assert(dbQueryStub.calledOnce);
      assert(idStub.callCount, 10);
      sinon.assert.calledWith(dbQueryStub, 
        'INSERT INTO Connections (connection_id, user_a, name, user_b) VALUES ' +
            '(?,?,?,(SELECT user_id FROM Users WHERE username=?)),' +
            '(?,?,?,(SELECT user_id FROM Users WHERE username=?)),' +
            '(?,?,?,?),' +
            '(?,?,?,?),' +
            '(?,?,?,?),' +
            '(?,?,?,(SELECT user_id FROM Users WHERE username=?)),' +
            '(?,?,?,?),' +
            '(?,?,?,?),' +
            '(?,?,?,?),' +
            '(?,?,?,(SELECT user_id FROM Users WHERE username=?));',
        [
          'id_0', 'main_user', 'connection_0', 'user_0',
          'id_1', 'main_user', 'connection_1', 'user_1',
          'id_2', 'main_user', 'connection_2', undefined,
          'id_3', 'main_user', 'connection_3', undefined,
          'id_4', 'main_user', 'connection_4', undefined,
          'id_5', 'main_user', 'connection_5', 'user_5',
          'id_6', 'main_user', 'connection_6', undefined,
          'id_7', 'main_user', 'connection_7', undefined,
          'id_8', 'main_user', 'connection_8', undefined,
          'id_9', 'main_user', 'connection_9', 'user_9'
        ]
      );
    });

    it('should return node info if db.query resolves', async function() {
      let connections = [
        { name: 'connection_1', linkedUsername: 'user_1' },
        { name: 'connection_2' }
      ];
      let dbQueryStub = sinon.stub(Database.prototype, 'query');
      dbQueryStub.resolves('success');
      let idStub = sinon.stub(id, 'genConnectionId');
      idStub.onCall(0).returns('id_0');
      idStub.onCall(1).returns('id_1');
      let result = await controller.addConnections('main_user', connections);
      assert.deepEqual(result, [
        { connectionId: 'id_0', name: 'connection_1', linkedUsername: 'user_1' },
        { connectionId: 'id_1', name: 'connection_2', linkedUsername: null }
      ]);
    });
  }); // #addConnections()

  describe('#getConnections()', function() {
    it('should call db.query with the correct arguments', async function() {
      let userId = 'main_user';
      let dbQueryStub = sinon.stub(Database.prototype, 'query');
      dbQueryStub.resolves([]);
      let result = await controller.getConnections('main_user');
      sinon.assert.calledWith(dbQueryStub,
        'SELECT c.connection_id, c.name, u.username, u.user_id FROM Users u, Connections c WHERE (c.user_a = ? AND c.user_b = u.user_id) OR (c.user_b = ? AND c.user_a = u.user_id) UNION SELECT c.connection_id, c.name, NULL, NULL FROM Connections c WHERE c.user_a = ? AND c.user_b is NULL;',
        [ userId, userId, userId ]
      );
    });

    it('should traverse through the graph and return the results', async function() {
      let userId = 'main_user';
      let dbQueryStub = sinon.stub(Database.prototype, 'query');
      dbQueryStub.onCall(0).resolves([
        { user_id: 'userid_1', name: 'name_1', username: 'username_1' },
        { user_id: 'userid_2', name: 'name_2', username: 'username_2' },
        { user_id: 'userid_3', name: 'name_3', username: 'username_3' },
      ]);
      dbQueryStub.onCall(1).resolves([]);
      dbQueryStub.onCall(2).resolves([]);
      dbQueryStub.onCall(3).resolves([
        { user_id: 'userid_4', name: 'name_4', username: 'username_4' },
        { user_id: 'main_user', name: 'main_name', username: 'main_username' }
      ]);
      dbQueryStub.onCall(4).resolves([
        { user_id: 'userid_5', name: 'name_5', username: 'username_5' },
        { user_id: 'main_user', name: 'main_name', username: 'main_username' },
        { user_id: 'userid_2', name: 'name_2', username: 'username_2' }
      ]);
      dbQueryStub.onCall(5).resolves([ { name: 'unlined_con_1' } ]);
      let result = await controller.getConnections('main_user');
      assert.equal(dbQueryStub.callCount, 6);
      sinon.assert.calledWith(dbQueryStub,
        'SELECT c.connection_id, c.name, u.username, u.user_id FROM Users u, Connections c WHERE (c.user_a = ? AND c.user_b = u.user_id) OR (c.user_b = ? AND c.user_a = u.user_id) UNION SELECT c.connection_id, c.name, NULL, NULL FROM Connections c WHERE c.user_a = ? AND c.user_b is NULL;',
        [ userId, userId, userId ]
      );
      sinon.assert.calledWith(dbQueryStub,
        'SELECT c.connection_id, c.name, u.username, u.user_id FROM Users u, Connections c WHERE (c.user_a = ? AND c.user_b = u.user_id) OR (c.user_b = ? AND c.user_a = u.user_id) UNION SELECT c.connection_id, c.name, NULL, NULL FROM Connections c WHERE c.user_a = ? AND c.user_b is NULL;',
        [ 'userid_1', 'userid_1', 'userid_1' ]
      );
      sinon.assert.calledWith(dbQueryStub,
        'SELECT c.connection_id, c.name, u.username, u.user_id FROM Users u, Connections c WHERE (c.user_a = ? AND c.user_b = u.user_id) OR (c.user_b = ? AND c.user_a = u.user_id) UNION SELECT c.connection_id, c.name, NULL, NULL FROM Connections c WHERE c.user_a = ? AND c.user_b is NULL;',
        [ 'userid_2', 'userid_2', 'userid_2' ]
      );
      sinon.assert.calledWith(dbQueryStub,
        'SELECT c.connection_id, c.name, u.username, u.user_id FROM Users u, Connections c WHERE (c.user_a = ? AND c.user_b = u.user_id) OR (c.user_b = ? AND c.user_a = u.user_id) UNION SELECT c.connection_id, c.name, NULL, NULL FROM Connections c WHERE c.user_a = ? AND c.user_b is NULL;',
        [ 'userid_3', 'userid_3', 'userid_3' ]
      );
      sinon.assert.calledWith(dbQueryStub,
        'SELECT c.connection_id, c.name, u.username, u.user_id FROM Users u, Connections c WHERE (c.user_a = ? AND c.user_b = u.user_id) OR (c.user_b = ? AND c.user_a = u.user_id) UNION SELECT c.connection_id, c.name, NULL, NULL FROM Connections c WHERE c.user_a = ? AND c.user_b is NULL;',
        [ 'userid_4', 'userid_4', 'userid_4' ]
      );
      sinon.assert.calledWith(dbQueryStub,
        'SELECT c.connection_id, c.name, u.username, u.user_id FROM Users u, Connections c WHERE (c.user_a = ? AND c.user_b = u.user_id) OR (c.user_b = ? AND c.user_a = u.user_id) UNION SELECT c.connection_id, c.name, NULL, NULL FROM Connections c WHERE c.user_a = ? AND c.user_b is NULL;',
        [ 'userid_5', 'userid_5', 'userid_5' ]
      );
      assert.deepEqual(result, {
        'main_user': [
          { name: 'name_1', username: 'username_1', id: 'userid_1' },
          { name: 'name_2', username: 'username_2', id: 'userid_2' },
          { name: 'name_3', username: 'username_3', id: 'userid_3' },
        ],
        'userid_1': [],
        'userid_2': [],
        'userid_3': [ { name: 'name_4', username: 'username_4', id: 'userid_4' } ],
        'userid_4': [ { name: 'name_5', username: 'username_5', id: 'userid_5' } ],
        'userid_5': [ { name: 'unlined_con_1', username: null, id: null } ]
      });
    });
  }); // #getConnections()
});