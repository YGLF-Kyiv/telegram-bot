const _ = require('lodash/fp');
const { DateTime } = require('luxon');

// Text and UI elements
const { BTN_TEXTS, BTN_DATA } = require('../constants/buttons');
const TEXTS = require('../constants/texts');

// Data
const { getSchedule } = require('../data/schedule');

// Helpers
const { getMainKeyboard, getMainInlineKeyboard, getTodayEvents, getCurrentDT } = require('./helpers');

const COMMON_REPLIES = {
  MAIN_MENU_WHATSON: 'MAIN_MENU_WHATSON',
  MAIN_MENU_SCHEDULE: 'MAIN_MENU_SCHEDULE',
  MAIN_MENU_INFO: 'MAIN_MENU_INFO',
  MAIN_MENU_EMERGENCY: 'MAIN_MENU_EMERGENCY',
  MAIN_MENU_ASK: 'MAIN_MENU_ASK',
};

async function getCommonReply(replyName) {
  const schedule = await getSchedule();
  switch (replyName) {
    case COMMON_REPLIES.MAIN_MENU_WHATSON:
      const currentDT = getCurrentDT();
      const todayEvents = await getTodayEvents();
      const nowEventIndex = _.findIndex((event) => {
        return event.startDT <= currentDT && event.endDT > currentDT;
      }, todayEvents);
      const nowEvent = todayEvents[nowEventIndex];
      const nextEvent = todayEvents[nowEventIndex + 1];
      return {
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
    case COMMON_REPLIES.MAIN_MENU_SCHEDULE:
      return {
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
    case COMMON_REPLIES.MAIN_MENU_INFO:
      return {
        text: TEXTS.INFO,
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.INFO_CONTACT_ORGS, callback_data: BTN_DATA.INFO_CONTACT_ORGS } ],
              [ { text: BTN_TEXTS.INFO_LOCATION, callback_data: BTN_DATA.INFO_LOCATION } ],
              [ { text: BTN_TEXTS.INFO_WORKSHOPS, callback_data: BTN_DATA.INFO_WORKSHOPS } ],
              [ { text: BTN_TEXTS.INFO_PARTIES, callback_data: BTN_DATA.INFO_PARTIES } ],
              [ { text: BTN_TEXTS.BACK_TO_MAIN, callback_data: BTN_DATA.BACK_TO_MAIN } ],
            ],
          },
        },
      };

    case COMMON_REPLIES.MAIN_MENU_EMERGENCY:
      return {
        text: TEXTS.EMERGENCY,
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.BACK_TO_MAIN, callback_data: BTN_DATA.BACK_TO_MAIN } ],
            ],
          },
        },
      };
    case COMMON_REPLIES.MAIN_MENU_ASK:
      return {
        text: TEXTS.ASK_QUESTIONS,
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.BACK_TO_MAIN, callback_data: BTN_DATA.BACK_TO_MAIN } ],
            ],
          },
        },
      };
  }
}

// reply getters
async function getReply(text, user) {
  switch (text) {
    case '/start':
      return {
        text: TEXTS.START,
        params: {
          reply_markup: {
            keyboard: getMainKeyboard(),
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        },
      };
    case BTN_TEXTS.MAIN_MENU_WHATSON:
      return {
        ...(await getCommonReply(COMMON_REPLIES.MAIN_MENU_WHATSON)),
      };
    case BTN_TEXTS.MAIN_MENU_SCHEDULE:
      return {
        ...(await getCommonReply(COMMON_REPLIES.MAIN_MENU_SCHEDULE)),
      };
    case BTN_TEXTS.MAIN_MENU_INFO:
      return {
        ...(await getCommonReply(COMMON_REPLIES.MAIN_MENU_INFO)),
      };
    case BTN_TEXTS.MAIN_MENU_EMERGENCY:
      return {
        ...(await getCommonReply(COMMON_REPLIES.MAIN_MENU_EMERGENCY)),
      };
    case BTN_TEXTS.MAIN_MENU_ASK:
      return {
        ...(await getCommonReply(COMMON_REPLIES.MAIN_MENU_ASK)),
      };
    default:
      return {
        text: TEXTS.MAIN,
        params: {
          reply_markup: {
            inline_keyboard: getMainInlineKeyboard(user),
          }
        }
      };
  }
}

async function getCallbackReply(data, user) {
  const schedule = await getSchedule();

  switch (data) {
    case BTN_DATA.MAIN_MENU_WHATSON:
      return {
        replyType: 'edit',
        ...(await getCommonReply(COMMON_REPLIES.MAIN_MENU_WHATSON)),
      };
    case BTN_DATA.MAIN_MENU_SCHEDULE:
      return {
        replyType: 'edit',
        ...(await getCommonReply(COMMON_REPLIES.MAIN_MENU_SCHEDULE)),
      };
    case BTN_DATA.MAIN_MENU_INFO:
    case BTN_DATA.INFO_BACK_TO_INFO:
      return {
        replyType: 'edit',
        ...(await getCommonReply(COMMON_REPLIES.MAIN_MENU_INFO)),
      };
    case BTN_DATA.MAIN_MENU_EMERGENCY:
      return {
        replyType: 'edit',
        ...(await getCommonReply(COMMON_REPLIES.MAIN_MENU_EMERGENCY)),
      };
    case BTN_DATA.MAIN_MENU_ASK:
      return {
        replyType: 'edit',
        ...(await getCommonReply(COMMON_REPLIES.MAIN_MENU_ASK)),
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
            inline_keyboard: getMainInlineKeyboard(user),
          }
        }
      };
    case BTN_DATA.INFO_CONTACT_ORGS:
      return {
        replyType: 'edit',
        text: TEXTS.INFO_CONTACT_ORGS,
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.INFO_BACK_TO_INFO, callback_data: BTN_DATA.INFO_BACK_TO_INFO } ],
            ],
          },
        },
      };
    case BTN_DATA.INFO_LOCATION:
      return [
        {
          replyType: 'venue',
          venue: {
            latitude: '50.449181',
            longtitude: '30.541182',
            address: 'Parkova Rd, 16a, Kyiv, 02000',
            title: 'Congress and Exhibition Center "Parkovy"',
          },
        },
        {
          replyType: 'send',
          text: TEXTS.INFO_LOCATION,
          params: {
            reply_markup: {
              inline_keyboard: [
                [ { text: BTN_TEXTS.INFO_BACK_TO_INFO, callback_data: BTN_DATA.INFO_BACK_TO_INFO } ],
              ],
            },
          },
        }
      ];
    case BTN_DATA.INFO_WORKSHOPS:
      return {
        replyType: 'edit',
        text: TEXTS.INFO_WORKSHOPS,
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.INFO_BACK_TO_INFO, callback_data: BTN_DATA.INFO_BACK_TO_INFO } ],
            ],
          },
        },
      };
    case BTN_DATA.INFO_PARTIES:
      return {
        replyType: 'edit',
        text: TEXTS.INFO_PARTIES,
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

module.exports = { getCallbackReply, getReply };
