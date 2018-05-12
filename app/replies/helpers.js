const { DateTime } = require('luxon');
const { getSchedule } = require('../data/schedule');
const { BTN_TEXTS, BTN_DATA } = require('../constants/buttons');

const midnight24to25 = DateTime.fromObject({
  zone: 'Europe/Kiev', day: 25, month: 5, year: 2018, hour: 0, minute: 0,
});
function getCurrentDT() {
  // return DateTime.fromObject({
  //   zone: 'Europe/Kiev', day: 25, month: 5, hour: 17, minute: 29,
  // });
  return DateTime.fromObject({ zone: 'Europe/Kiev' });
}
async function getTodayEvents() {
  const schedule = await getSchedule();
  return getCurrentDT() > midnight24to25 ? schedule[1].events : schedule[0].events;
}

function getMainKeyboard(user) {
  let keyboard = [
    [ { text: BTN_TEXTS.MAIN_MENU_WHATSON, callback_data: BTN_DATA.MAIN_MENU_WHATSON } ],
    [ { text: BTN_TEXTS.MAIN_MENU_SCHEDULE, callback_data: BTN_DATA.MAIN_MENU_SCHEDULE } ],
    [ { text: BTN_TEXTS.MAIN_MENU_INFO, callback_data: BTN_DATA.MAIN_MENU_INFO } ],
    [ { text: BTN_TEXTS.MAIN_MENU_ASK, callback_data: BTN_DATA.MAIN_MENU_ASK } ],
  ];
  if (user.isAdmin) {
    keyboard.push(
      [ { text: BTN_TEXTS.MAIN_MENU_ADMIN, callback_data: BTN_DATA.MAIN_MENU_ADMIN } ],
    )
  }
  return keyboard;
}

module.exports = { getMainKeyboard, getTodayEvents, getCurrentDT };
