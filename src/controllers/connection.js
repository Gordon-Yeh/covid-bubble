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

module.exports = {
  addConnections,
}