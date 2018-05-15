const _ = require('lodash/fp');
const { DateTime } = require('luxon');
const { WEBSITE_URL, SCHEDULE_URL, SLIDO_CODE } = require('./common');

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
  START: [
    'Hi, I\'m YGLF Bot! I will be with you in the days of the conference.',
    '',
    'Most importantly: I am completely unobtrusive and always ready to share with you the most useful information!',
    WEBSITE_URL
  ].join('\n'),
  MAIN: 'How can I help you?',
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
  INFO_CONTACT_ORGS: [
    'In case you have any questions before, during or after the conference you can contact us:',
    'Yuri - @yuritkachenko',
    'Katia - @salivan_k, +380 99 984 88 70',
    'Polina - @Polya_p, +380 98 705 44 49'
  ].join('\n'),
  INFO_FAQ: ['1231232222222'].join('\n'),
  EMERGENCY: [
    '@salivan_k or <a href="tel:+380999848870">+380999848870</a>'
  ].join('\n'),
  ASK_QUESTIONS: [
    'You can ask any question to the current speaker here:',
    `<a href="https://sli.do#${SLIDO_CODE}">sli.do#${SLIDO_CODE}</a>`,
  ].join('\n'),

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
