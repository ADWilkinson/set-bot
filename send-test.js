const { runGetMessage, runPostMessageToDiscord } = require('./index');
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook(
  'https://discord.com/api/webhooks/863667320077680690/nURYUFO_2Gaq-TZyxU8MHDDhkTrl9XaviihDsolQvAH6CNJ_Y6G7QXnyj9nyBC4bdYtr'
);

const runProcess = async () => {
  const message = await runGetMessage();
  await runPostMessageToDiscord(message, hook);
};

runProcess()
  .then((res) => console.log(res))
  .catch((error) => console.log(error));
