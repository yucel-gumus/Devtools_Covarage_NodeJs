const puppeteer = require("puppeteer");
const fs = require("fs").promises;

const projectname = "unusedFindNodeJS";
const urlToTest = ["example.com"];

const run = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage(),
  ]);

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const [jsCoverage, cssCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
      page.coverage.stopCSSCoverage(),
    ]);

    let totalBytes = 0;
    let usedBytes = 0;

    const coverage = [...jsCoverage, ...cssCoverage];
    for (const entry of coverage) {
      if (entry.url.includes(".js") || entry.url.includes(".css")) {
        totalBytes += entry.text.length;
        let singleUsedBytes = 0;
        for (const range of entry.ranges) {
          usedBytes += range.end - range.start - 1;
          singleUsedBytes += range.end - range.start - 1;
        }

        const singleUnusedBytes =
          100 - (singleUsedBytes / entry.text.length) * 100;
        if (singleUnusedBytes > 98) {
          await fs.appendFile(
            `results/${projectname}/data.csv`,
            `${url}, ${entry.url}, ${singleUnusedBytes.toFixed(1)}%\r\n`
          );
        }
      }
    }
  } catch (error) {
    console.error("Hata oluştu:", error);
  } finally {
    await browser.close();
  }
};

const start = async () => {
  try {
    await fs.mkdir(`results/${projectname}`, { recursive: true });
    const header = "URL, Varlık URL, Kullanılmayan Yüzde\r\n";
    try {
      await fs.access(`results/${projectname}/data.csv`);
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.writeFile(`results/${projectname}/data.csv`, header);
      } else {
        throw error;
      }
    }

    for (const url of urlToTest) {
      await run(url);
    }
  } catch (error) {
    console.error("Hata oluştu:", error);
  }
};

start();
