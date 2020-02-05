const puppeteer = require('puppeteer');
const fs = require('fs');

// headless:false, --auto-open-devtools-for-tabs - opens devtools

const fetchPage = async() => {
  let browser;
  let globalTimeout = setTimeout(() => {
    exitCode = 1
    throw new Error('Puppeeteer Global Time Out 30000')
  }, 30000)
  let exitCode = 0;
  try {
    browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    try {
     await page.goto(process.argv[2], {timeout: 5000, waitUntil: 'domcontentloaded'});
     const predicateString = process.argv[4]
     await page.waitForFunction(predicateString, {timeout: 18000});
    } catch (e) {
      console.log(`Puppeteer error ${e.message} happened when fetching page`)
      exitCode = 1
    }
    const bodyHTML = await page.content()
    if (bodyHTML.length > 0) {
      fs.writeFileSync(process.argv[3], bodyHTML)
    }
  } catch (err) {
      console.log(err.message);
  } finally {
    clearTimeout(globalTimeout)
    if (browser) {
      browser.close();
    }
    process.exit(exitCode);
  }
};
fetchPage();
