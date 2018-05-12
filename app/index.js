'use strict';
const express = require('express');

// Import replies and callback data
const { getCallbackReply, getReply } = require('./replies/replies');
const { getAdminCallbackReply, getAdminReply } = require('./replies/admin-replies');

// Fetch ENV
let ENV = {};
try { ENV = require('../env.json') || {}; } catch(err) {}
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_YGLF_TOKEN || ENV.TELEGRAM_BOT_YGLF_TOKEN;
const SUPERADMIN_ID = process.env.SUPERADMIN_ID || ENV.SUPERADMIN_ID;

// Database and schedule data
const { authUser, fetchUsers } = require('./data/db');
const { fetchSchedule } = require('./data/schedule');

// Telegram config
const TBot = require('node-telegram-bot-api');
const telegram = new TBot(TELEGRAM_TOKEN, { polling: true });

// Error logger
const logError = require('./logger')(telegram, SUPERADMIN_ID);

// App config
const app = express();
app.set('port', (process.env.PORT || 5000));
app.get('/', function (req, res) {
  res.send('Nothing is here');
  res.end();
});

// Telegram reply sender
const FORM_DEFAULTS = {
  parse_mode: 'HTML',
  disable_web_page_preview: true,
};
async function sendReply(message, reply) {
  if (reply.notifications) {
    reply.notifications.forEach(async (notification) => {
      await telegram.sendMessage(
        notification.userId,
        notification.text,
        FORM_DEFAULTS,
      );
    });
  }
  switch (reply.replyType) {
    case 'edit':
      return await telegram.editMessageText(
        reply.text,
        {
          ...FORM_DEFAULTS,
          ...reply.params,
          message_id: message.message_id,
          chat_id: message.chat.id,
        }
      );
    case 'send':
    default:
      return await telegram.sendMessage(
        message.chat.id,
        reply.text,
        { ...FORM_DEFAULTS, ...reply.params }
      );
  }
}

// Initializing event listening
telegram.on('text', async (message) => {
  try {
    const { text, from } = message;
    const user = await authUser(from);
    if (user.isBlocked) { return; }

    console.log(`-> Got a message "${text}" from ${from.first_name} ${from.last_name}, registered in DB "${user.id}"`);


    const reply = await getAdminReply(text, user) || await getReply(text, user);
    reply && await sendReply(message, reply);
  } catch(e) {
    logError({ e, event: 'text', data: message});
  }
});
telegram.on('callback_query', async ({ id, message, data, from }) => {
  try {
    const user = await authUser(from);
    if (user.isBlocked) { return; }

    console.log(`-> Got a callback query "${data}" from ${from.first_name} ${from.last_name}, registered in DB "${user.id}"`);

    const reply = await getAdminCallbackReply(data, user) || await getCallbackReply(data, user);
    reply && await sendReply(message, reply);
  } catch(e) {
    logError({ e, event: 'text', data: { id, message, data, from } });
  }
});

// Starting app
app.listen(app.get('port'), async function () {
  await fetchSchedule();
  const usersCount = await fetchUsers();
	console.log('-> YGLF Bot is running on port', app.get('port'));
});
