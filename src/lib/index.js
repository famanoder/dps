const { formatUrl, log } = require('./utils');
const ppteer = require('./pp');
const evalScripts = require('./drawPageStructureScript');
const fs = require('fs');
const path = require('path');

class DrawPageStructure {
  constructor({
      entry,
      rootSelector = '#app',
      output
    } = {}) {
      if(!entry) {
        log.error('please provide entry path or url !', 1); 
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
    // setTimeout(async () => {
      await page.screenshot({
        path: './page.jpg'
      });
      const html = await page.evaluate(evalScripts);
      log.info(html);

      let pagePath = path.resolve('index.html');
      fs.readFile(pagePath, (err, data) => {
        if(err) {
          log.error(err);
        }else{
          fs.writeFileSync(pagePath, data.toString().replace('APP', html));
        }
      });
      log.info(`正在截圖預覽...`);
      
      await pp.browser.close();
      log.info(`哦了，浏览器已关闭。bye`);
    // }, 5000);
  }
}

new DrawPageStructure({
  entry: 'https://www.jianshu.com/'
}).start();