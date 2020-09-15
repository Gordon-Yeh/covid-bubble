const mysql = require('mysql');

class Database {
  constructor() {
    let port = process.env.DB_PORT;
    let host = process.env.DB_HOST;
    let user = process.env.DB_USER;
    let password = process.env.DB_PWD;
    let name = process.env.DB_NAME;
    this.db = mysql.createConnection({
      port, host, user, password, database: name
    });
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.db.connect((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      })
    })
  }

  async query(...args) {
    return new Promise((resolve, reject) => {
      this.db.query(...args, (err, res, fields) => {
        if (err)
          reject(err);
        resolve(res, fields);
      });
    })
  }

  async end() {
    return new Promise((resolve, reject) => {
      this.db.end(resolve);
    })
  }

  escape(text) {
    return this.db.escape(text);
  }
}

module.exports = Database;