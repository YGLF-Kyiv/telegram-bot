const { Client } = require('pg');
const { DateTime } = require('luxon');
const normalize = require('normalize-object');

let ENV = {};
try { ENV = require('../../env.json') || {}; } catch(err) {}

const DB_HOST = process.env.DB_HOST || ENV.DB_HOST;
const DB_DATABASE = process.env.DB_DATABASE || ENV.DB_DATABASE;
const DB_USER = process.env.DB_USER || ENV.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD || ENV.DB_PASSWORD;
const SUPERADMIN_ID = process.env.SUPERADMIN_ID || ENV.SUPERADMIN_ID;

// DB Cache
let cache = {
  users: null,
  lastUpdated: null,
};
function updateCache({ users }) {
  cache = {
    ...cache,
    users,
    lastUpdated: DateTime.fromObject({ zone: 'Europe/Kiev' }),
  };
  console.log(`-> Cache updated. There are ${Object.keys(cache.users).length} users.`);
  return cache;
}

// DB Methods
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
      response = normalize(response);
      console.log(`-> Users were fetched. There are ${response.rowCount} users in DB.`);
      updateCache({
        users: response.rows.reduce((acc, user) => ({
          ...acc,
          [user.userId]: {
            ...user,
            isSuperAdmin: user.userId === SUPERADMIN_ID,
          },
        }), {}),
      });
      return response.rowCount;
    });
  });
}
function addUser(from) {
  const client = connectToDb();
  return client.connect().then(() => {
    return client
      .query({
        text: 'INSERT INTO users(user_id, first_name, last_name, username) VALUES($1, $2, $3, $4)',
        values: [from.id, from.first_name, from.last_name, from.username],
      })
      .then(() => client.end());
  });
}

// API
async function getUsers() {
  if (!cache.lastUpdated) {
    await fetchUsers();
  }
  return cache.users;
}
async function getUser(userId) {
  if (!cache.lastUpdated) {
    await fetchUsers();
  }
  return cache.users[userId];
}
async function authUser(from) {
  const userId = from.id;
  let user = await getUser(userId);
  if (!user) {
    await addUser(from);
    await fetchUsers();
    user = await getUser(userId);
  }
  return user;
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
  getUsers,
  authUser,
};
