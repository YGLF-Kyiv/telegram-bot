const fetch = require('node-fetch');
const { constructSchedule } = require('./utils');
let cache = {
  scheduleData: null,
  speakersData: null,
  schedule: null,
};
async function fetchScheduleData() {
  const response = await fetch('https://raw.githubusercontent.com/YGLF-Kyiv/website-2018/master/data/schedule.json');
  cache.scheduleData = await response.json();
}
async function fetchSpeakersData() {
  const response = await fetch('https://raw.githubusercontent.com/YGLF-Kyiv/website-2018/master/data/speakers.json');
  cache.speakersData = await response.json();
}
async function fetchSchedule() {
  await fetchScheduleData();
  await fetchSpeakersData();
  console.log('-> Schedule was updated');
}

async function getScheduleData() {
  if (!cache.scheduleData) {
    await fetchScheduleData();
  }
  return cache.scheduleData;
}
async function getSpeakersData() {
  if (!cache.speakersData) {
    await fetchSpeakersData();
  }
  return cache.speakersData;
}
async function getSchedule() {
  if (!cache.schedule) {
    const scheduleData = await getScheduleData();
    const speakersData = await getSpeakersData();
    cache.schedule = constructSchedule(scheduleData.days, speakersData.all);
  }
  return cache.schedule;
}

module.exports = {
  getSchedule,
  fetchSchedule,
};
