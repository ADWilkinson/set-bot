const scraperClient = require('scraperapi-sdk')('d668ceea885d0125abbd1a112775c6a1');
const fs = require('fs');
const map = require('./addressMap');
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook(
  'https://discord.com/api/webhooks/863667320077680690/nURYUFO_2Gaq-TZyxU8MHDDhkTrl9XaviihDsolQvAH6CNJ_Y6G7QXnyj9nyBC4bdYtr'
);
const runScrape = async () => {
  Object.keys(map.addressMap).forEach(async (key, index) => {
    setTimeout(async function () {
      const page = await scraperClient.get('https://www.tokensets.com/v2/set/' + key, {
        render: true,
      });
      console.log(page);

      fs.writeFile('../scrapingData/' + key + '.txt', page, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }, index * 1000);
  });
};


const runProcess = async () => {
  await runScrape();
};

runProcess.then((res) => console.log(res)).catch((error) => console.log(error));
