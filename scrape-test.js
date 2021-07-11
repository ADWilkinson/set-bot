const { runScrape } = require('./index');

const runProcess = async () => {
  await runScrape();
};

runProcess()
  .then((res) => console.log(res))
  .catch((error) => console.log(error));
