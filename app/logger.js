let ENV = {};
try { ENV = require('../env.json') || {}; } catch(err) {}

let errorsCounter = {};
const logger = (telegram, chatId) => ({ event, e, data }) => {
  const errorString = String(e);
  if (!errorsCounter[errorString]) { errorsCounter[errorString] = 0 }
  errorsCounter[errorString]++;
  const log = [
    errorString,
    `Event: ${event}`,
    `Data: ${JSON.stringify(data)}`,
    `Error happened ${errorsCounter[errorString]} times`,
  ];
  log.forEach((str) => console.log(str));

  // Limit sending error reports to telegram
  if (errorsCounter[errorString] > 10) { return; }
  return telegram.sendMessage(
    chatId,
    log.join('\n'),
    {}
  )
};

const resetCounter = () => errorsCounter = {};

module.exports = {
  logger,
  resetCounter
};
