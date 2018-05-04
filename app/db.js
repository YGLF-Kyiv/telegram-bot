const { Client } = require('pg');
let ENV = {};
try {
  ENV = require('../env.json') || {};
} catch(err) {}

const DB_HOST = process.env.DB_HOST || ENV.DB_HOST;
const DB_DATABASE = process.env.DB_DATABASE || ENV.DB_DATABASE;
const DB_USER = process.env.DB_USER || ENV.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD || ENV.DB_PASSWORD;

function connectToDb() {
  const client = new Client({
    host: DB_HOST,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD,
    port: '5432',
    ssl: true,
  });
  return client;
}
function fetchUsers() {
  const client = connectToDb();
  return client.connect().then(() => {
    return client.query('SELECT * FROM users WHERE TRUE').then((response) => {
      client.end();
      return response.rows;
    });
  });
}
function addUser(from) {
  const client = connectToDb();
  client.connect().then(() => {
    client
      .query({
        text: 'INSERT INTO users(user_id, first_name, last_name, username) VALUES($1, $2, $3, $4)',
        values: [from.id, from.first_name, from.last_name, from.username],
      })
      .then(() => client.end());
  });
}
// function updateAnswers(id, answers, correctAnswers) {
//   const client = connectToDb();
//   client.connect().then(() => {
//     client.query({
//       text: 'UPDATE winners SET answers = $1, correct_answers = $2 WHERE telegram_id = $3',
//       values: [ JSON.stringify(answers), correctAnswers, id ],
//     })
//       .then(() => {
//         client.end();
//       });
//   });
// }

module.exports = {
  fetchUsers,
  addUser,
};
