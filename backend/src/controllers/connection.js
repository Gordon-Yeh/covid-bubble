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

async function getConnections(rootUserId) {
  LOG('nodes.getConnections():', `users=${rootUserId}`);
  let sql = 'SELECT c.connection_id, c.name, u.username, u.user_id FROM Users u, Connections c WHERE (c.user_a = ? AND c.user_b = u.user_id) OR (c.user_b = ? AND c.user_a = u.user_id)'
            + ' UNION ' + 'SELECT c.connection_id, c.name, NULL, NULL FROM Connections c WHERE c.user_a = ? AND c.user_b is NULL;';
  let adjList = {};
  let visited = new Set();
  let queue = [ [ rootUserId, 0 ] ];
  let idCounter = 1;

  try {
    visited.add(rootUserId);
    while (queue.length > 0) {
      let [ userId, listId ] = queue.shift();
      let res = await db.query(sql, [userId, userId, userId]);
      adjList[listId] = [];
      res.forEach(c => {
        if (c.user_id != null && !visited.has(c.user_id)) {
          const cListId = (idCounter++).toString();
          adjList[listId].push({
            name: c.name,
            username: c.username,
            id: cListId
          });
          visited.add(c.user_id);
          queue.push([ c.user_id, cListId ]);
        } else if (c.user_id == null) {
          const cListId = (idCounter++).toString();
          adjList[listId].push({
            name: c.name,
            id: cListId
          });
        }
      });
    }
    return adjList;
  } catch (e) {
    LOG(e);
    console.log(e);
    throw DBError('database_error');
  }
}

module.exports = {
  getConnections,
  addConnections
}