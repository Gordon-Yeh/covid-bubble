const { v4: uuidv4 } = require('uuid');

function genUserId() {
  return uuidv4();
}

function genConnectionId() {
  return uuidv4();
}

module.exports = {
  genUserId,
  genConnectionId
};