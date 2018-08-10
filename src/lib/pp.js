const ppteer = require('puppeteer');
const { log } = require('./utils');

const devices = {
  mobile: [375, 667, 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'],
  ipad: [1024, 1366, 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'],
  pc: [1200, 1000, 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1']
};

async function pp({device = 'mobile', headless = true}) {
  const browser = await ppteer.launch({headless});
  
  async function openPage(url) {
    const page = await browser.newPage();
    try{
      let deviceSet = devices[device];
      // page.waitForNavigation({timeout: 2000});
      page.setUserAgent(deviceSet[2]);
      page.setViewport({width: deviceSet[0], height: deviceSet[1]});
      await page.goto(url, {
        waitUntil: 'networkidle0'
      });
    }catch(e){
      log.error('\n' + e.message, 1);
    }
    return page;
  }
  return {
    browser,
    openPage
  }
};

module.exports = pp;