const core = require("@actions/core");
const github = require("@actions/github");
const exec = require("@actions/exec");
const path = require("path");

try {
  core.startGroup("Async Processing");

  return core
    .group("Async Processing", async () => {
      await exec.exec("npm install puppeteer");

      const puppeteer = require("puppeteer");

      console.log(JSON.stringify(puppeteer, null, 2));

      const filePath = core.getInput("path-to-markup-file");

      const browser = await puppeteer.launch({
        product: "chrome",
        headless: true,
      });

      const page = await browser.newPage();

      await page.goto(`file://${path.resolve(filePath)}`);

      const branchName = github.context.ref.split("/").pop();

      core.setOutput("branch-name", branchName);

      const outputPdfPath = path.resolve(`${branchName}.pdf`);

      const pdf = await page.pdf({
        path: outputPdfPath,
        format: "letter",
      });

      return outputPdfPath;
    })
    .then((data) => {
      core.setOutput("output-pdf-path", data);
      core.endGroup();
      process.exit(0);
    })
    .catch((error) => {
      core.setFailed(error.message);
    });
} catch (error) {
  core.setFailed(error.message);
}
