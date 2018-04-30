'use strict';
const _ = require('lodash/fp');
const express = require('express');
const TBot = require('node-telegram-bot-api');
const { DateTime } = require('luxon');
const optional = require('optional');

// Telegram config
const ENV = optional('../env.json') || {};
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_YGLF_TOKEN || ENV.TELEGRAM_BOT_YGLF_TOKEN;

// Text and UI elements
const { BTN_TEXTS, BTN_DATA } = require('./constants/buttons');
const TEXTS = require('./constants/texts');

// Data
const scheduleData = require('../data/schedule');
const speakersData = require('../data/speakers');
const { constructSchedule } = require('./utils');
const schedule = constructSchedule(scheduleData.days, speakersData.all);
const midnight24to25 = DateTime.fromObject({
  zone: 'Europe/Kiev', day: 25, month: 5, year: 2018, hour: 0, minute: 0,
});

const app = express();
const telegram = new TBot(TELEGRAM_TOKEN, { polling: true });

const FORM_DEFAULTS = {
  parse_mode: 'HTML',
  disable_web_page_preview: true,
};

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
	res.send('Nothing is here');
	res.end();
});

// function getReplyKeyboardMarkup(keyboard) {
//   return {
//     keyboard,
//     one_time_keyboard: true,
//     resize_keyboard: true,
//   }
// }
function getCurrentDT() {
  // return DateTime.fromObject({
  //   zone: 'Europe/Kiev', day: 25, month: 5, hour: 17, minute: 29,
  // });
  return DateTime.fromObject({ zone: 'Europe/Kiev' });
}
function getTodayEvents() {
  return getCurrentDT() > midnight24to25 ? schedule[1].events : schedule[0].events;
}

function getReply(text) {
  switch (text) {
    default:
      return {
        text: text === '/start' ? TEXTS.START : TEXTS.MAIN,
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.MAIN_MENU_WHATSON, callback_data: BTN_DATA.MAIN_MENU_WHATSON } ],
              [ { text: BTN_TEXTS.MAIN_MENU_SCHEDULE, callback_data: BTN_DATA.MAIN_MENU_SCHEDULE } ],
              [ { text: BTN_TEXTS.MAIN_MENU_INFO, callback_data: BTN_DATA.MAIN_MENU_INFO } ],
              [ { text: BTN_TEXTS.MAIN_MENU_ASK, callback_data: BTN_DATA.MAIN_MENU_ASK } ],
            ],
          }
        }
      };
  }
}

function getCallbackReply(data) {
  switch (data) {
    case BTN_DATA.MAIN_MENU_WHATSON:
      const currentDT = getCurrentDT();
      const todayEvents = getTodayEvents();
      const nowEventIndex = _.findIndex((event) => {
        return event.startDT <= currentDT && event.endDT > currentDT;
      }, todayEvents);
      const nowEvent = todayEvents[nowEventIndex];
      const nextEvent = todayEvents[nowEventIndex + 1];
      return {
        replyType: 'edit',
        text: TEXTS.WHATSON(nowEvent, nextEvent),
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.WHATSON_SCHEDULE_DAY1, callback_data: BTN_DATA.SCHEDULE_DAY1 } ],
              [ { text: BTN_TEXTS.WHATSON_SCHEDULE_DAY2, callback_data: BTN_DATA.SCHEDULE_DAY2 } ],
              [ { text: BTN_TEXTS.BACK_TO_MAIN, callback_data: BTN_DATA.BACK_TO_MAIN } ],
            ],
          }
        }
      };
    case BTN_DATA.MAIN_MENU_SCHEDULE:
      return {
        replyType: 'edit',
        text: TEXTS.SCHEDULE(schedule[0]),
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.SCHEDULE_DAY2, callback_data: BTN_DATA.SCHEDULE_DAY2 } ],
              [ { text: BTN_TEXTS.BACK_TO_MAIN, callback_data: BTN_DATA.BACK_TO_MAIN } ],
            ],
          },
        },
      };
    case BTN_DATA.MAIN_MENU_INFO:
      return {
        replyType: 'edit',
        text: TEXTS.INFO,
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.INFO_FAQ, callback_data: BTN_DATA.INFO_FAQ } ],
              [ { text: BTN_TEXTS.INFO_CONTACT_ORGS, callback_data: BTN_DATA.INFO_CONTACT_ORGS } ],
              [ { text: BTN_TEXTS.INFO_LOCATION, callback_data: BTN_DATA.INFO_LOCATION } ],
              [ { text: BTN_TEXTS.INFO_YGLF_COM, callback_data: BTN_DATA.INFO_YGLF_COM } ],
              [ { text: BTN_TEXTS.INFO_WIFI_PASSWORD, callback_data: BTN_DATA.INFO_WIFI_PASSWORD } ],
              [ { text: BTN_TEXTS.BACK_TO_MAIN, callback_data: BTN_DATA.BACK_TO_MAIN } ],
            ],
          },
        },
      };
    case BTN_DATA.SCHEDULE_DAY1:
      return {
        replyType: 'edit',
        text: TEXTS.SCHEDULE(schedule[0]),
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.SCHEDULE_DAY2, callback_data: BTN_DATA.SCHEDULE_DAY2 } ],
              [ { text: BTN_TEXTS.BACK_TO_MAIN, callback_data: BTN_DATA.BACK_TO_MAIN } ],
            ],
          },
        },
      };
    case BTN_DATA.SCHEDULE_DAY2:
      return {
        replyType: 'edit',
        text: TEXTS.SCHEDULE(schedule[1]),
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.SCHEDULE_DAY1, callback_data: BTN_DATA.SCHEDULE_DAY1 } ],
              [ { text: BTN_TEXTS.BACK_TO_MAIN, callback_data: BTN_DATA.BACK_TO_MAIN } ],
            ],
          },
        },
      };
    case BTN_DATA.BACK_TO_MAIN:
      return {
        replyType: 'edit',
        text: TEXTS.MAIN,
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.MAIN_MENU_WHATSON, callback_data: BTN_DATA.MAIN_MENU_WHATSON } ],
              [ { text: BTN_TEXTS.MAIN_MENU_SCHEDULE, callback_data: BTN_DATA.MAIN_MENU_SCHEDULE } ],
              [ { text: BTN_TEXTS.MAIN_MENU_INFO, callback_data: BTN_DATA.MAIN_MENU_INFO } ],
              [ { text: BTN_TEXTS.MAIN_MENU_ASK, callback_data: BTN_DATA.MAIN_MENU_ASK } ],
            ],
          }
        }
      };
    case BTN_DATA.INFO_BACK_TO_INFO:
      return {
        replyType: 'edit',
        text: TEXTS.INFO,
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.INFO_FAQ, callback_data: BTN_DATA.INFO_FAQ } ],
              [ { text: BTN_TEXTS.INFO_CONTACT_ORGS, callback_data: BTN_DATA.INFO_CONTACT_ORGS } ],
              [ { text: BTN_TEXTS.INFO_LOCATION, callback_data: BTN_DATA.INFO_LOCATION } ],
              [ { text: BTN_TEXTS.INFO_YGLF_COM, callback_data: BTN_DATA.INFO_YGLF_COM } ],
              [ { text: BTN_TEXTS.INFO_WIFI_PASSWORD, callback_data: BTN_DATA.INFO_WIFI_PASSWORD } ],
              [ { text: BTN_TEXTS.BACK_TO_MAIN, callback_data: BTN_DATA.BACK_TO_MAIN } ],
            ],
          },
        },
      };
    case BTN_DATA.INFO_FAQ:
    case BTN_DATA.INFO_CONTACT_ORGS:
    case BTN_DATA.INFO_LOCATION:
    case BTN_DATA.INFO_YGLF_COM:
    case BTN_DATA.INFO_WIFI_PASSWORD:
      return {
        replyType: 'edit',
        text: 'Ah, look!',
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.INFO_BACK_TO_INFO, callback_data: BTN_DATA.INFO_BACK_TO_INFO } ],
            ],
          },
        },
      };
  }
}

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

telegram.on('callback_query', ({ id, message, data, from }) => {
  console.log(`-> Got a callback query "${data}" from ${from.first_name} ${from.last_name}`);

  const reply = getCallbackReply(data);
  return sendReply(message, reply);
});

app.listen(app.get('port'), function () {
	console.log('YGLF Bot is running on port', app.get('port'));
});
