const { DateTime } = require('luxon');
const { getSchedule } = require('../data/schedule');
const { BTN_TEXTS, BTN_DATA } = require('../constants/buttons');

const day1Start = DateTime.fromObject({
  zone: 'Europe/Kiev', day: 24, month: 5, year: 2018, hour: 0, minute: 0,
});
const day2Start = DateTime.fromObject({
  zone: 'Europe/Kiev', day: 25, month: 5, year: 2018, hour: 0, minute: 0,
});
const day2End = DateTime.fromObject({
  zone: 'Europe/Kiev', day: 26, month: 5, year: 2018, hour: 0, minute: 0,
});
function getCurrentDT() {
  // return DateTime.fromObject({
  //   zone: 'Europe/Kiev', day: 25, month: 5, hour: 17, minute: 29,
  // });
  return DateTime.fromObject({ zone: 'Europe/Kiev' });
}
async function getTodayEvents() {
  const schedule = await getSchedule();
  return getCurrentDT() > day2Start ? schedule[1].events : schedule[0].events;
}

function isLive() {
  const currentDT = getCurrentDT();
  return currentDT > day1Start && currentDT < day2End;
}

function getMainInlineKeyboard(user) {
  let keyboard = [
    [ { text: BTN_TEXTS.MAIN_MENU_WHATSON, callback_data: BTN_DATA.MAIN_MENU_WHATSON } ],
    [ { text: BTN_TEXTS.MAIN_MENU_ASK, callback_data: BTN_DATA.MAIN_MENU_ASK } ],
    [ { text: BTN_TEXTS.MAIN_MENU_SCHEDULE, callback_data: BTN_DATA.MAIN_MENU_SCHEDULE } ],
    [ { text: BTN_TEXTS.MAIN_MENU_INFO, callback_data: BTN_DATA.MAIN_MENU_INFO } ],
    [ { text: BTN_TEXTS.MAIN_MENU_EMERGENCY, callback_data: BTN_DATA.MAIN_MENU_EMERGENCY } ],
  ];
  if (isLive()) {
    keyboard.unshift();
  }
  if (user.isAdmin) {
    keyboard.push(
      [ { text: BTN_TEXTS.MAIN_MENU_ADMIN, callback_data: BTN_DATA.MAIN_MENU_ADMIN } ]
    )
  }
  return keyboard;
}

function getMainKeyboard() {
  return [
    [ BTN_TEXTS.MAIN_MENU_WHATSON ],
    [ BTN_TEXTS.MAIN_MENU_ASK ],
    [ BTN_TEXTS.MAIN_MENU_SCHEDULE ],
    [ BTN_TEXTS.MAIN_MENU_INFO ],
    [ BTN_TEXTS.MAIN_MENU_EMERGENCY ],
  ];
}

module.exports = { getMainKeyboard, getMainInlineKeyboard, getTodayEvents, getCurrentDT, isLive };
