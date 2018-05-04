'use strict';
const express = require('express');
const TBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

// Import replies
const { getCallbackReply, getReply } = require('./replies');

// Fetch ENV
let ENV = {};
try { ENV = require('../env.json') || {}; } catch(err) {}

// Database
const db = require('./db');

// Telegram config
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_YGLF_TOKEN || ENV.TELEGRAM_BOT_YGLF_TOKEN;
const telegram = new TBot(TELEGRAM_TOKEN, { polling: true });

// App config
const app = express();
app.set('port', (process.env.PORT || 5000));
app.get('/', function (req, res) {
  res.send('Nothing is here');
  res.end();
});

const FORM_DEFAULTS = {
  parse_mode: 'HTML',
  disable_web_page_preview: true,
};

function sendReply(message, reply) {
  switch (reply.replyType) {
    case 'edit':
      return telegram.editMessageText(
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
      return telegram.sendMessage(
        message.chat.id,
        reply.text,
        { ...FORM_DEFAULTS, ...reply.params }
      );
  }
}

telegram.on('text', (message) => {
  const { text, from } = message;

  console.log(`-> Got a message "${text}" from ${from.first_name} ${from.last_name}`);

  const reply = getReply(text);
  sendReply(message, reply);
});

telegram.on('callback_query', async ({ id, message, data, from }) => {
  console.log(`-> Got a callback query "${data}" from ${from.first_name} ${from.last_name}`);

  const reply = await getCallbackReply(data);
  return sendReply(message, reply);
});

app.listen(app.get('port'), function () {
	console.log('YGLF Bot is running on port', app.get('port'));
});

// (async () => {
//   const items = await db.fetchUsers();
//   console.log(items);
// })();
