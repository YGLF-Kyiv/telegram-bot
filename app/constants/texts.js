const _ = require('lodash/fp');
const { DateTime } = require('luxon');
const { SCHEDULE_URL } = require('./common');

function getEventText(event) {
  if (event.speakerId) {
    return `<a href="${SCHEDULE_URL}#${event.anchor}">${event.title}</a> by ${event.speakerData.speakerName}`;
  } else {
    return event.title;
  }
}
function getTime(dt) {
  return dt.toLocaleString(DateTime.TIME_24_SIMPLE);
}
module.exports = {
  START: 'Hi! I am YGLF Wizard. Press the menu button.',
  MAIN: 'What whould you like to know?',
  WHATSON: (now, next) => {
    let lines = [];
    if (now) {
      lines.push(`– NOW: ${getEventText(now)} till ${getTime(now.endDT)}`);
    }
    if (next) {
      lines.push(`– NEXT: ${getEventText(next)} ${getTime(next.startDT)} – ${getTime(next.endDT)}`);
    }
    return lines.join('\n');
  },
  SCHEDULE: (day) => {
    let lines = [];
    lines.push(`<b>${day.title} – ${day.date}</b>`);
    lines.push('');
    day.events.forEach((event) => {
      lines.push(`${event.emoji} ${getTime(event.startDT)} – ${getEventText(event)}`);
    });
    return lines.join('\n');
  },
  INFO: 'Please, select from below',

  ADMIN: 'Hi. This is very restricted area. How\'re you doing?',
  ADMIN_APP_REFRESHED: ({ usersCount }) => (
    `Schedule was fetched from github and users list was updated. There are ${usersCount} users.`
  ),
  ADMIN_SEND_NOTIFICATION: 'Please, send text of your notification in chat',
  ADMIN_SEND_NOTIFICATION_APPROVE: (text) => {
    let lines = [];
    lines.push('Ok, now please approve that the message that you\'re going to send is:');
    lines.push('--------------------');
    lines.push(text);
    lines.push('--------------------');
    lines.push('Please, notive that ALL users registered will get this message');
    return lines.join('\n');
  },
  ADMIN_SEND_NOTIFICATION_DECLINED: 'Ok, declined. Anything else?',
  ADMIN_SEND_NOTIFICATION_SENT: (text) => {
    let lines = [];
    lines.push('The next notification has been sent:');
    lines.push('--------------------');
    lines.push(text);
    lines.push('--------------------');
    return lines.join('\n');
  },
};
