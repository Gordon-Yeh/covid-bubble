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
        resolve(res);
      });
    })
  }

  async end() {
    return new Promise((resolve, reject) => {
      this.db.end(resolve);
    })
  }

  isDupEmailError(err) {
    return err && err.message && err.message.includes('ER_DUP_ENTRY') && err.message.includes('email');
  }
}

module.exports = Database;