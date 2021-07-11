const scraperClient = require('scraperapi-sdk')('d668ceea885d0125abbd1a112775c6a1');
const fs = require('fs');
const map = require('../addressMap');
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook(
  'https://discord.com/api/webhooks/863477263928262656/FBbtS8RxgU6GT-ICODLN_F3ePVeUfvzB7AaNyRJtOG5J9wYEX0oc2KyC1Q9hSnYLqC3d'
);
var cron = require('node-cron');

const runGetMessage = async () => {
  let message = '';
  var files = fs.readdirSync('../report');
  const reportArr = files.map((file) => {
    return JSON.parse(fs.readFileSync('../report/' + file, 'utf8'));
  });

  const sortedArr = reportArr.sort((a, b) => parseFloat(b.priceChange) - parseFloat(a.priceChange));

  message += '**Set Performance Leaderboard** 📈\n\n';
  sortedArr.forEach((set, index) => {
    if (index == 0) {
      message += `🥇 **${set.name}**\nPrice: ${set.price} -- Change (%): ${set.priceChange} | AUM: ${set.aum} -- Change (%): ${set.aumChange}\n`;
    } else if (index == 1) {
      message += `🥈 **${set.name}**\nPrice: ${set.price} -- Change (%): ${set.priceChange} | AUM: ${set.aum} -- Change (%): ${set.aumChange}\n`;
    } else if (index == 2) {
      message += `🥉 **${set.name}**\nPrice: ${set.price} -- Change (%): ${set.priceChange} | AUM: ${set.aum} -- Change (%): ${set.aumChange}\n`;
    } else {
      message += `**${set.name}**\nPrice: ${set.price} -- Change (%): ${set.priceChange} | AUM: ${set.aum} -- Change (%): ${set.aumChange}\n`;
    }
  });
  return message;
};

const runPostMessageToDiscord = async (message) => {
  try {
    await hook.send(message);
  } catch (error) {
    console.log(error);
  }
};

const runProcess = async () => {
  const message = await runGetMessage();
  await runPostMessageToDiscord(message);
};

runProcess.then((res) => console.log(res)).catch((error) => console.log(error));
