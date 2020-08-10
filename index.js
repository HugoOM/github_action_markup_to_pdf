const core = require("@actions/core");
const github = require("@actions/github");
const puppeteer = require("puppeteer");
const path = require("path");

(async function () {
  try {
    // `who-to-greet` input defined in action metadata file
    // const nameToGreet = core.getInput("who-to-greet");
    const filePath = core.getInput("path-to-markup-file");

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(`file://${path.resolve(filePath)}`);

    const pdf = await page.pdf({
      path: path.resolve("./rendered", core.getInput("branch-name")),
      format: "letter",
    });

    // const time = new Date().toTimeString();
    core.setOutput("pdf-file-binary", pdf.toString());
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2);
    // console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
