const ppteer = require('puppeteer');
const { log } = require('./utils');

async function pp() {
  const browser = await ppteer.launch({headless: true});
  
  async function openPage(url) {
    const page = await browser.newPage();
    try{
      await page.goto(url);
    }catch(e){
      log.info(e);
    }
    return page;
  }
  return {
    browser,
    openPage
  }
};

module.exports = pp;