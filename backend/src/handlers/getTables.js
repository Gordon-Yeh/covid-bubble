'use strict';
const { LOG } = require('../utils/log');

async function handler(event) {
  const Database = require('../db');
  LOG('getTables.handler', event);

  let db = new Database(process.env.DB_NAME);
  try {
    let results = await db.query('SHOW tables;');
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    }
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    }
  }
};

module.exports = {
  handler
};