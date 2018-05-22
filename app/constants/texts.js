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
      lines.push(`${event.emoji || ''} ${getTime(event.startDT)} – ${getEventText(event)}`);
    });
    return lines.join('\n');
  },
  INFO: 'Pick what you\'d like to know',
  INFO_CONTACT_ORGS: [
    'In case you have any questions before, during or after the conference you can contact us:',
    '',
    'Yuri - @yuritkachenko, +38097 788 38 57',
    'Katia - @salivan_k, +380 99 984 88 70',
    'Polina - @Polya_p, +380 98 705 44 49',
    'Andrei - @viattik',
    '',
    'Also, you can join our chat (@yglfchat) and channel (@yglfkyiv)'
  ].join('\n'),
  EMERGENCY: [
    'Call <b>+380999848870</b> (Katia)'
  ].join('\n'),
  ASK_QUESTIONS: [
    'You can ask your question to the speaker or vote for one of questions asked by someone else here:',
    `<a href="https://sli.do#${SLIDO_CODE}">sli.do#${SLIDO_CODE}</a>`,
    'In the end of each talk the speaker will answer the most voted ones.'
  ].join('\n'),
  INFO_LOCATION: [
    '<b>The most comfortable way to get to Parkovy is by walking from the nearest subway stations.</b>',
    '',
    'From Arsenalna: <a href="https://goo.gl/maps/hQX9wrdLnhG2">https://goo.gl/maps/hQX9wrdLnhG2</a> — 1 km.',
    'From European Square  (Yevropeiska Ploshcha): <a href="https://goo.gl/maps/9dqTq2gb7FN2">https://goo.gl/maps/9dqTq2gb7FN2</a> — 1.3 km.',
    '',
    '<b>It’s important!</b> If you have any difficulties with walking such a distance, please let us know. We will make every effort to get you to Parkovy and back. Please ping hello@yglf.com.ua or call Yuri Tkachenko – +380977883857.'
  ].join('\n'),
  INFO_WORKSHOPS: [
    '<b>Webpack — The Good Parts</b>',
    '',
    'If you want to get to the workshop of the Webpack Core Team after the conference, you have a perfect opportunity to get a ticket with the discount just for $99. Use the promo code `<code>YGLFPeople</code>`.',
    'You can buy a ticket and find out the details here:',
    '<a href="https://2event.com/ru/events/1230538">https://2event.com/ru/events/1230538</a>',
    'The workshop will take place on Saturday, May 26 at the Wix office.',
    'Address: <a href="https://goo.gl/maps/AKWcdkoRgJD2">14A Pankivska street</a>',
    '',
    '---',
    '',
    '<b>New Adventures in Responsive Web Design</b>',
    '',
    'Wix Engineering, the conference sponsor, is offering the participants to attend Vitaly Friedman’s workshop \'New Adventures in Responsive Web Design\' for <b>free</b>.',
    'Register here:',
    '<a href="https://docs.google.com/forms/u/1/d/e/1FAIpQLSfgZYwuC1ap9EB5YO9sRaKP-dqZJbMEpa6dHMvkqD7uL4hiyA/viewform">https://docs.google.com/forms/u/1/d/e/1FAIpQLSfgZYwuC1ap9EB5YO9sRaKP-dqZJbMEpa6dHMvkqD7uL4hiyA/viewform</a>',
    'The workshop will take place on Saturday, May 26 at the Peremoha space:',
    '<a href="https://peremoga.space/ru/spaces/#lounge_hall">https://peremoga.space/ru/spaces/#lounge_hall</a>',
  ].join('\n'),
  INFO_PARTIES: [
    '<b>Take a walk around Kyiv.</b>',
    '',
    'We’ve organized walks around Kyiv with awesome guides from Walk and Talk for our speakers and participants. They are free of charge, but you need to sign up in this form beforehand at a convenient time:',
    'https://docs.google.com/forms/d/e/1FAIpQLSc_kcHtOgXiK9paFuJYW7PEJdzk0CYHfocFSQ-JVOGsHaL9gg/viewform',
    '',
    '---',
    '',
    '<b>About the party.</b> We are having two parties!',
    '',
    'On the first day on May 24th right after the last talk and some almost obscene joke from our MC Bruce, we’re moving to the CHI restaurant which is located a couple of storeys higher.',
    'We are preparing a good menu with snacks and different alcoholic beverages.',
    'Excellent music will be provided by Denis Adu’s quintet and a DJ with a good taste.',
    'We promise that it won’t be too loud. You’ll be able to talk because CHI restaurant has a terrasse which is very suitable for that!',
    'On the second day right after the keynote of the Vitaliy Frieman and again Bruce’s jokes, we are going to prepare several varieties of cider and Varvar beer. Some appropriate snacks and then it’s your turn - get acquainted with each other and feel free to socialize. After all, conferences take place just for this!',
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
