const scraperClient = require('scraperapi-sdk')('d668ceea885d0125abbd1a112775c6a1');
const fs = require('fs');
const map = require('./addressMap');
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook(
  'https://discord.com/api/webhooks/863667320077680690/nURYUFO_2Gaq-TZyxU8MHDDhkTrl9XaviihDsolQvAH6CNJ_Y6G7QXnyj9nyBC4bdYtr'
);
var cron = require('node-cron');

const runScrape = async () => {
  Object.keys(map.addressMap).forEach(async (key, index) => {
    setTimeout(async function () {
      const page = await scraperClient.get('https://www.tokensets.com/v2/set/' + key, {
        render: true,
      });
      console.log(page);

      fs.writeFile('./scrapingData/' + key + '.txt', page, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }, index * 1000);
  });
};

const diff = (a, b) => {
  let numA = parseFloat(a.replace('$', ''));
  let numB = parseFloat(b.replace('$', ''));
  return ((100 * (numB - numA)) / ((numB + numA) / 2)).toFixed(2);
};

const runReports = async () => {
  var files = fs.readdirSync('./scrapingData').map((file) => file.replace('.txt', ''));

  files.forEach((set) => {
    fs.readFile('./scrapingData/' + set + '.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const length = 15;
      const aumIndex = data.indexOf('>$');
      const aum = data.substr(aumIndex, length);
      const convertedAum = '$' + aum.replace(',', '').match(/[\d\.\,]+/)[0];
      console.log(convertedAum);

      const slice = data.slice(aumIndex + length, data.length);
      const tokenPriceIndex = slice.indexOf('>$');
      const tokenPrice = slice.substr(tokenPriceIndex, length);
      const convertedTokenPrice = '$' + tokenPrice.replace(',', '').match(/[\d\.\,]+/)[0];
      console.log(convertedTokenPrice);

      try {
        const report = JSON.parse(fs.readFileSync('./report/' + set + '.json', 'utf8'));

        console.log(report);
        let result = {
          name: map.addressMap[set],
          aum: convertedAum,
          price: convertedTokenPrice,
          aumChange: diff(convertedAum, report.aum),
          priceChange: diff(convertedTokenPrice, report.price) + '%',
        };
        console.log(result);
        fs.writeFile('./report/' + set + '.json', JSON.stringify(result), (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      } catch (error) {
        let result = {
          name: map.addressMap[set],
          aum: convertedAum,
          price: convertedTokenPrice,
          aumChange: '0%',
          priceChange: '0%',
        };
        console.log(result);
        fs.writeFile('./report/' + set + '.json', JSON.stringify(result), (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
    });
  });
};

const runGetMessage = async () => {
  let message = '';
  var files = fs.readdirSync('./report');
  const reportArr = files.map((file) => {
    return JSON.parse(fs.readFileSync('./report/' + file, 'utf8'));
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

const task1 = cron.schedule('0 */4 * * *', async () => {
  console.log('running a task every minute');
  await runScrape();
});

const task2 = cron.schedule('5 */4 * * *', async () => {
  console.log('running a task every minute');
  await runReports();
});

const task3 = cron.schedule('10 */4 * * *', async () => {
  const message = await runGetMessage();
  await runPostMessageToDiscord(message);
});

console.log(task1, task2, task3);
