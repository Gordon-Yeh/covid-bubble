'use strict';
const { LOG } = require('../utils/log');
const id = require('../utils/id');
const Database = require('../db');
const { DBError } = require('../utils/error');
var db = new Database();

async function addConnections(userId, connections) {
  LOG('nodes.addConnections():', `users=${userId}`, 'connections=', connections);

  let sql = 'INSERT INTO Connections (connection_id, user_a, name, user_b) VALUES ';
  let rows = [];
  let vals = [];
  let res = [];
  connections.forEach(ele => {
    if (ele.linkedUsername)
      rows.push('(?,?,?,(SELECT user_id FROM Users WHERE username=?))')
    else
      rows.push('(?,?,?,?)');
    let connectionId = id.genConnectionId();
    vals.push(connectionId, userId, ele.name, ele.linkedUsername);
    res.push({
      connectionId,
      name: ele.name,
      linkedUsername: ele.linkedUsername ? ele.linkedUsername : null,
    });
  });
  try {
    await db.query(sql+rows.join(',')+';', vals);
    return res;
  } catch (e) {
    throw DBError('database_error');
  }
}

async function getConnections(userId) {
  LOG('nodes.getConnections():', `users=${userId}`);
  let sql = 'SELECT c.connection_id, c.name, u.username, u.user_id FROM Users u, Connections c WHERE (c.user_a = ? AND c.user_b = u.user_id) OR (c.user_b = ? AND c.user_a = u.user_id)'
            + ' UNION ' + 'SELECT c.connection_id, c.name, NULL, NULL FROM Connections c WHERE c.user_a = ? AND c.user_b is NULL;';
  let adjList = {};
  let queue = [ userId ];
  let visited = new Set();

  try {
    visited.add(userId);
    while (queue.length > 0) {
      let parent = queue.shift();
      let res = await db.query(sql, [parent, parent, parent]);
      adjList[parent] = [];
      res.forEach(con => {
        if (con.user_id != null && !visited.has(con.user_id)) {
          adjList[parent].push({
            name: con.name,
            username: con.username,
            id: con.user_id
          });
          visited.add(con.user_id);
          queue.push(con.user_id);
        } else if (con.user_id == null) {
          adjList[parent].push({
            name: con.name,
            username: null,
            id: null
          });
        }
      });
    }
    return adjList;
  } catch (e) {
    LOG(e);
    throw DBError('database_error');
  }
}

module.exports = {
  getConnections,
  addConnections
}