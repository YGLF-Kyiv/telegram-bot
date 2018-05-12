// Constants
const { BTN_TEXTS, BTN_DATA } = require('../constants/buttons');
const TEXTS = require('../constants/texts');

// Database and schedule data
const { fetchUsers, getUsers } = require('../data/db');
const { fetchSchedule } = require('../data/schedule');

const ADMIN_KEYBOARD = [
  [ { text: BTN_TEXTS.ADMIN_REFRESH_APP, callback_data: BTN_DATA.ADMIN_REFRESH_APP } ],
  [ { text: BTN_TEXTS.ADMIN_SEND_NOTIFICATION, callback_data: BTN_DATA.ADMIN_SEND_NOTIFICATION } ],
  [ { text: BTN_TEXTS.BACK_TO_MAIN, callback_data: BTN_DATA.BACK_TO_MAIN } ],
];
const AWAITING_MESSAGE_PLACEHOLDER = 'AWAITING_MESSAGE_PLACEHOLDER';

// Here we hold all users that we expect to send us something
let awaitingMessages = {};


async function getAdminReply(text, user) {
  if (!user.isAdmin) { return; }
  if (awaitingMessages[user.userId]) {
    if (awaitingMessages[user.userId] === AWAITING_MESSAGE_PLACEHOLDER) {
      awaitingMessages[user.userId] = text;
      return {
        replyType: 'send',
        text: TEXTS.ADMIN_SEND_NOTIFICATION_APPROVE(text),
        params: {
          reply_markup: {
            inline_keyboard: [
              [ { text: BTN_TEXTS.ADMIN_APPROVE, callback_data: BTN_DATA.ADMIN_SEND_NOTIFICATION_APPROVE } ],
              [ { text: BTN_TEXTS.ADMIN_DECLINE, callback_data: BTN_DATA.ADMIN_SEND_NOTIFICATION_DECLINE } ],
            ],
          },
        }
      }
    }
  }
}

async function getAdminCallbackReply(data, user) {
  if (!user.isAdmin) { return; }
  switch(data) {
    case BTN_DATA.MAIN_MENU_ADMIN:
      return {
        replyType: 'edit',
        text: TEXTS.ADMIN,
        params: {
          reply_markup: {
            inline_keyboard: ADMIN_KEYBOARD,
          },
        },
      };
    case BTN_DATA.ADMIN_REFRESH_APP:
      await fetchSchedule();
      const usersCount = await fetchUsers();
      return {
        replyType: 'edit',
        text: TEXTS.ADMIN_APP_REFRESHED({ usersCount }),
        params: {
          reply_markup: {
            inline_keyboard: ADMIN_KEYBOARD,
          },
        },
      };
    case BTN_DATA.ADMIN_SEND_NOTIFICATION:
      awaitingMessages[user.userId] = AWAITING_MESSAGE_PLACEHOLDER;
      return {
        replyType: 'send',
        text: TEXTS.ADMIN_SEND_NOTIFICATION
      };
    case BTN_DATA.ADMIN_SEND_NOTIFICATION_APPROVE:
      const message = awaitingMessages[user.userId];
      const users = await getUsers();
      const notifications = Object.values(users).map(({ userId }) => ({
        userId,
        text: message,
      }));
      if (!message) { return; }
      delete awaitingMessages[user.userId];
      return {
        replyType: 'edit',
        text: TEXTS.ADMIN_SEND_NOTIFICATION_SENT(message),
        notifications,
      };
    case BTN_DATA.ADMIN_SEND_NOTIFICATION_DECLINE:
      delete awaitingMessages[user.userId];
      return {
        replyType: 'edit',
        text: TEXTS.ADMIN_SEND_NOTIFICATION_DECLINED,
        params: {
          reply_markup: {
            inline_keyboard: ADMIN_KEYBOARD,
          },
        },
      }
  }
}

module.exports = { getAdminCallbackReply, getAdminReply };
