const _ = require('lodash/fp');
const { DateTime } = require('luxon');

// Text and UI elements
const { BTN_TEXTS, BTN_DATA } = require('../constants/buttons');
const TEXTS = require('../constants/texts');

// Data
const { getSchedule } = require('../data/schedule');

// Helpers
const { getMainKeyboard, getTodayEvents, getCurrentDT } = require('./helpers');

// reply getters
function getReply(text, user) {
  switch (text) {
    case '/start':
      return {
        text: TEXTS.START,
        params: {
          reply_markup: {
            keyboard: [ [ BTN_TEXTS.MENU ] ],
            resize_keyboard: true,
          },
        },
      };
    default:
      return {
        text: TEXTS.MAIN,
        params: {
          reply_markup: {
            inline_keyboard: getMainKeyboard(user),
          }
        }
      };
  }
}

async function getCallbackReply(data, user) {
  const schedule = await getSchedule();

  switch (data) {
    case BTN_DATA.MAIN_MENU_WHATSON:
      const currentDT = getCurrentDT();
      const todayEvents = await getTodayEvents();
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
            inline_keyboard: getMainKeyboard(user),
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

module.exports = { getCallbackReply, getReply };
