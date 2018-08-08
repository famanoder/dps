const { formatUrl, log } = require('./utils');
const ppteer = require('./pp');
const evalScripts = require('./drawPageStructureScript');
const fs = require('fs');
const path = require('path');
const ora = require('ora');

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
    const spinner = ora('').start();
    spinner.color = 'yellow';

	  spinner.text = '开始启动浏览器了...';
    const pp = await ppteer();

    spinner.text = `正在打开页面：${ pageUrl }...`;
    const page = await pp.openPage(pageUrl);

    spinner.text = '正在生成骨架屏...';
    // setTimeout(async () => {
      const html = await page.evaluate(evalScripts);

      let pagePath = path.resolve('index.html');
      fs.readFile(pagePath, (err, data) => {
        if(err) {
          log.error(err);
        }else{
          fs.writeFileSync(pagePath, `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" /> 
                <meta content="telephone=no" name="format-detection"/>
                <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover" name="viewport" />
                <title>DrawPagestructure.test</title> 
                <script>
                </script>
            </head> 
              <body>
                <div id="app">${html}</div>
              </body>
            </html>`);
        }
      });
      spinner.text = `正在截圖預覽...`;
      await page.screenshot({
        path: './page.jpg'
      });
      
      await pp.browser.close();
      log.info(`\n哦了，浏览器已关闭。bye`);
      spinner.stop();
    // }, 5000);
  }
}

new DrawPageStructure({
  entry: 'https://www.baidu.com/'
}).start();