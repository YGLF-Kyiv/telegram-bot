const { DateTime } = require('luxon');

function constructSchedule(schedule, speakers) {
  return schedule.map(day => {
    const events = day.events.map((event, index) => {
      const speaker = speakers.find(el => el.id === event.speakerId);
      const speakerName = speaker ? `${speaker.firstName} ${speaker.lastName}` : null;
      const speakerData = speaker
        ? {
          speakerName,
          ...speaker,
        }
        : {};

      const startDT = DateTime.fromObject({
        day: day.day,
        month: 5,
        year: 2018,
        hour: Number(event.time.hours),
        minute: Number(event.time.minutes),
        zone: 'Europe/Kiev',
      });
      const nextEvent = day.events[index + 1];
      const endDT = nextEvent
        ? DateTime.fromObject({
          day: day.day,
          month: 5,
          year: 2018,
          hour: Number(nextEvent.time.hours),
          minute: Number(nextEvent.time.minutes),
          zone: 'Europe/Kiev',
        })
        : DateTime.fromObject({
          day: day.day + 1,
          month: 5,
          year: 2018,
          hour: 0,
          minute: 0,
          zone: 'Europe/Kiev',
        });
      return {
        ...event,
        speakerData,
        startDT,
        endDT,
        anchor: getAnchor(event, speakerName, index)
      };
    });
    return { ...day, events };
  });
}

function getAnchor(event, name, uniq) {
  if (event.anchor) return event.anchor;
  if (name) return `${encodeAndReplace(name)}-${event.title.split(/\b/)[0]}`
  return `${encodeAndReplace(event.title)}-${uniq}`
}

function encodeAndReplace(str) {
  return encodeURI(str.replace(/\s/g, '-'))
}

module.exports = { constructSchedule };
