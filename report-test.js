const { runReports } = require('./index');

const runProcess = async () => {
  await runReports();
};

runProcess()
  .then((res) => console.log(res))
  .catch((error) => console.log(error));
