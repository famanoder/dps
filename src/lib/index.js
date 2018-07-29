const { formatUrl, log } = require('./utils');
const ppteer = require('./pp');
const evalScripts = require('./drawPageStructureScript');

class DrawPageStructure {
  constructor({
      entry,
      output
    } = {}) {
      if(!entry) {
        log.error('please provide entry path or url !'); 
      }
      this.entry = formatUrl(entry);
  }
  async start() {
    const pageUrl = this.entry;
    log.info(`开始启动浏览器了...`);
    const pp = await ppteer();
    log.info(`正在打开页面：${ pageUrl }...`);
    const page = await pp.openPage(pageUrl);
    log.info(`正在生成骨架屏...`);
    await page.evaluate(evalScripts);
    setTimeout(async () => {
      const html = await page.$eval('body', e => e.outerHTML);
      log.info(html);
      await page.screenshot({
        path: './page.jpg'
      });
      await pp.browser.close();
      log.info(`浏览器已关闭。bye`);
    }, 2000);
  }
}

new DrawPageStructure({
  entry: 'https://famanoder.com'
}).start();