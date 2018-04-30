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
  START: 'Hi! I am YGLF Wizard. I will guide you through the conference. What whould you like to know?',
  MAIN: 'What whould you like to know?',
  WHATSON: (now, next) => {
    let lines = [];
    if (now) {
      lines.push(`- NOW: ${getEventText(now)} till ${getTime(now.endDT)}`);
    }
    if (next) {
      lines.push(`- NEXT: ${getEventText(next)} ${getTime(next.startDT)} - ${getTime(next.endDT)}`);
    }
    return lines.join('\n');
  },
  SCHEDULE: (day) => {
    let lines = [];
    lines.push(`<b>${day.title} - ${day.date}</b>`);
    lines.push('');
    day.events.forEach((event) => {
      lines.push(`${getTime(event.startDT)} - ${getEventText(event)}`);
    });
    return lines.join('\n');
  },
  INFO: 'Please, select from below',
};
