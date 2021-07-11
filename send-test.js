const config = require('./config').config;
const { runGetMessage, runPostMessageToDiscord } = require('./index');
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook(config.testWebhook);

const runProcess = async () => {
  const message = await runGetMessage();
  await runPostMessageToDiscord(message, hook);
};

runProcess()
  .then((res) => console.log(res))
  .catch((error) => console.log(error));
