const { DateTime } = require('luxon');

function constructSchedule(schedule, speakers) {
  return schedule.map(day => {
    const events = day.events.map((event, i) => {
      const speaker = speakers.find(el => el.id === event.speakerId);
      const speakerData = speaker
        ? {
          speakerName: speaker ? `${speaker.firstName} ${speaker.lastName}` : null,
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
      const nextEvent = day.events[i + 1];
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
        startDT,
        endDT,
        speakerData,
        anchor: speaker
          ? `${speaker.anchor}-${day.day}-${event.time.hours}-${event.time.minutes}`
          : `${day.day}-${event.time.hours}-${event.time.minutes}`
      };
    });
    return { ...day, events };
  });
}

module.exports = { constructSchedule };
