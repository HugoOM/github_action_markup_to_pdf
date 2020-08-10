const exec = require("@actions/exec");
const core = require("@actions/core");

core.startGroup("Async Install");

core.group("Async Install", async () => {
  await exec.exec("npm install puppeteer");

  core.endGroup();

  process.exit(0);
});
