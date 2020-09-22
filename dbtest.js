mysql = require('mysql')

db = mysql.createConnection({ host: 'localhost', user: 'root', port: 9000, database: 'CobuDB', password: '123123'});
console.log('INSERT USER')
user = ['user_test_id1', 'email@test.com', 'John', 'Smith', '123123']

function insertUser(userId, email, firstName, lastName, password, callback) {
  db.query('INSERT INTO Users VALUES (?, ?, ?, ?, ?)',
  [userId, email, firstName, lastName, password],
  callback);
}

function printAndCall(callback) {
  return (err, results, fields) => {
    if (err)
      console.log('error:', err.name, err.message)
    console.log('results:', results);
    callback();
    console.log('fields:', fields)
  }
}
function authenticate(email, password, callback) {
  console.log('AUTHENTICATE');
  db.query('SELECT user_id, first_name, last_name FROM Users WHERE email=? AND password=?', [email, password], (err, results, fields) => {
    if (err)
      console.log('error:', err.name, err.message)
    if (results.length > 0) {
      console.log(`results: user_id=${results[0].user_id}`)
    }
    console.log('fields:', fields)
  });
}

insertUser(
  'user_test_id1', 'email@test.com', 'John', 'Smith', '123123',
  printAndCall(() => {
    authenticate('email@test.com', '123123', printAndCall)
  })
);