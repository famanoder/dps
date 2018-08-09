const { log, getAgrType } = require('./utils');
const ppteer = require('./pp');
const evalScripts = require('./drawPageStructureScript');
const fs = require('fs');
const chalk = require('chalk');
const cheerio = require('cheerio');
const path = require('path');
const ora = require('ora');
const emoji = require('node-emoji');

class DrawPageStructure {
  constructor({
      url,
      output = {},
      device,
      headless,
      drawPageStructure
    } = {}) {
      this.url = url;
      this.filepath = path.resolve(__dirname, output.filepath || '');
      this.injectSelector = output.injectSelector || '#app';
      this.device = device;
      this.headless = headless;
      this.drawPageStructure = drawPageStructure;

      if(!url) {
        log.error('please provide entry url !', 1); 
      }
      if(!output.filepath) {
        log.error('please provide output filepath !', 1); 
      }
  }
  async generateSkeletonHTML(page) {

    const html = await page.evaluate(evalScripts);
    
    return html;

  }
  writeToFilepath(html) {
    let filepath = this.filepath;
    let fileHTML = fs.readFileSync(filepath);
    let $ = cheerio.load(fileHTML);
    $(this.injectSelector).html(html);
    fs.writeFileSync(filepath, $.html('html'));
  }
  async start() {
    const pageUrl = this.url;
    const spinner = ora({
      spinner: {
        "interval": 125,
        "frames": [
          "∙∙∙",
          "●∙∙",
          "∙●∙",
          "∙∙●",
          "∙∙∙"
        ]
      }
    }).start();
    spinner.color = 'magentaBright';

	  spinner.text = '启动浏览器...';
    const pp = await ppteer({
      device: this.device,
      headless: this.headless
    });

    spinner.text = `正在打开页面：${ pageUrl }...`;
    const page = await pp.openPage(pageUrl);

    spinner.text = '正在生成骨架屏...';
    const html = await this.generateSkeletonHTML(page);

    if(getAgrType(this.drawPageStructure) === 'function') {
      drawPageStructure(fs.writeFileSync, filepath, html);
    }else{
      this.writeToFilepath(html);
    }
    
    spinner.text = '浏览器已关闭.';
    spinner.text = `skeleton screen has created in ${this.filepath}`;
    await pp.browser.close();
    console.log(`\n%s  骨架屏已生成完毕.`, chalk.yellow(emoji.get('coffee')));
    spinner.stop();
  }
}

module.exports = DrawPageStructure;
// new DrawPageStructure({
//   // webpack插件的话，可以取webpack传过来的publicPath
//   publicPath: 'http://page.jd.com',
//   entry: '../../index.html',
//   headless: true
// }).start();

new DrawPageStructure({
  url: 'http://localhost:8080',
  output: {
    filepath: '../../example/index.html',
    injectSelector: '#app'
  },
  headless: true
}).start();


/**
 * 1. 入口文件为本地文件
 * 像create-react-app和vue-cli等脚手架工具，在开发环境下都是调用webpack在内存中生成的文件流，
 * 页面为模板，无静态资源相关的引用（除了第三方的），这时puppeteer将访问的页面是空白的，
 * 而且开发阶段页面上引用的路径大多为相对路径，puppeteer也将无法访问该资源，因为无头的原因，
 * 如果开启界面，体验不好；
 * 什么时候运行的问题：dev时运行，会严重影响速度；prod时运行不利于开发时预览；
 * 
 * 2. 入口文件为可访问的地址
 * 内网限制了必须等待30秒
 * 但是不存在puppeteer无法访问静态资源的问题
 * 单独一个命令生成骨架屏的DOM，插入到指定页面（index.html）
 * npm run DrawPageStructure >
 * url > html > [filepath, injectSelector]
*/
