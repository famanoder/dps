const ppteer = require('puppeteer');
const { log } = require('./utils');

async function pp() {
  const browser = await ppteer.launch({headless: true});
  
  async function openPage(url) {
    const page = await browser.newPage();
    try{
      page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
      page.setViewport({width: 375, height: 667});
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