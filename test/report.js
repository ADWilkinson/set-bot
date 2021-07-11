const scraperClient = require('scraperapi-sdk')('d668ceea885d0125abbd1a112775c6a1');
const fs = require('fs');
const map = require('../addressMap');
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook(
  'https://discord.com/api/webhooks/863477263928262656/FBbtS8RxgU6GT-ICODLN_F3ePVeUfvzB7AaNyRJtOG5J9wYEX0oc2KyC1Q9hSnYLqC3d'
);
var cron = require('node-cron');

const diff = (a, b) => {
  let numA = parseFloat(a.replace('$', ''));
  let numB = parseFloat(b.replace('$', ''));
  return ((100 * (numB - numA)) / ((numB + numA) / 2)).toFixed(2);
};

const runReports = async () => {
  var files = fs.readdirSync('../scrapingData').map((file) => file.replace('.txt', ''));

  files.forEach((set) => {
    fs.readFile('../scrapingData/' + set + '.txt', 'utf8', (err, data) => {
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
        const report = JSON.parse(fs.readFileSync('../report/' + set + '.json', 'utf8'));

        console.log(report);
        let result = {
          name: map.addressMap[set],
          aum: convertedAum,
          price: convertedTokenPrice,
          aumChange: diff(convertedAum, report.aum),
          priceChange: diff(convertedTokenPrice, report.price) + '%',
        };
        console.log(result);
        fs.writeFile('../report/' + set + '.json', JSON.stringify(result), (err) => {
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
        fs.writeFile('../report/' + set + '.json', JSON.stringify(result), (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
    });
  });
};

const runProcess = async () => {
  await runReports();
};

runProcess.then((res) => console.log(res)).catch((error) => console.log(error));
