const core = require("@actions/core");
const github = require("@actions/github");
const exec = require("@actions/exec");
const path = require("path");
const puppeteer = require("puppeteer");

// const chrome_url =
//   "https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux%2F99994%2Fchrome-linux.zip?generation=1&alt=media";

try {
  core.startGroup("Async Processing");

  return core
    .group("Async Processing", async () => {
      // await exec.exec(`wget ${chrome_url} -O ./temp.zip`);

      // await exec.exec("unzip temp.zip");

      const filePath = core.getInput("path-to-markup-file");

      const browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",
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
