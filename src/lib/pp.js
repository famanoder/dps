const ppteer = require('puppeteer');

async function pp() {
  const browser = await ppteer.launch();
  
  async function openPage(url) {
    const page = await browser.newPage();
    await page.goto(url);
    return page;
  }
  return {
    browser,
    openPage
  }
};

module.exports = pp;