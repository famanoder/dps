const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const cheerio = require('cheerio');
const ora = require('ora');
const { log, getAgrType, Spinner, emoji, toBase64 } = require('./utils');
const ppteer = require('./pp');
const evalScripts = require('../evalDOM');

class DrawPageStructure {
  constructor({
      url,
      output = {},
      background,
      animation,
      device,
      headless,
      writePageStructure,
      includeElement,
      init
    } = {}) {
      this.url = url;
      this.filepath = output.filepath;
      this.injectSelector = output.injectSelector || '#app';
      this.background = background;
      this.animation = animation || '';
      this.device = device;
      this.headless = false;
      this.writePageStructure = writePageStructure;
      this.includeElement = includeElement || '';
      this.init = init || '';

      if(!url) {
        log.error('please provide entry url !', 1); 
      }
      if(!output.filepath) {
        log.error('please provide output filepath !', 1); 
      }
      if(!fs.existsSync(output.filepath)) {
        log.error('please provide the absolute filepath !', 1); 
      }
  }
  async generateSkeletonHTML(page) {
    let html = '';

    try{
      html = await page.evaluate.call(page, evalScripts, this.init.toString(), this.includeElement.toString(), this.background, this.animation);
    }catch(e){
      log.error('\n[page.evaluate] ' + e.message, 1);
    }
    await page.screenshot({path: 'example.png'});
    let base64 = fs.readFileSync(path.resolve(__dirname, '../example.png')).toString('base64');
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
    const spinner = Spinner('magentaBright');

	  spinner.text = '启动浏览器...';
    const pp = await ppteer({
      device: this.device,
      headless: this.headless
    });

    spinner.text = `正在打开页面：${ pageUrl }...`;
    const page = await pp.openPage(pageUrl);

    spinner.text = '正在生成骨架屏...';
    const html = await this.generateSkeletonHTML(page);

    if(getAgrType(this.writePageStructure) === 'function') {
      this.writePageStructure(html, this.filepath);
    }
    if(this.filepath) {
      this.writeToFilepath(html);
    }

    console.log('');
    spinner.stop();
    // await pp.browser.close();
    console.log(' %s ', chalk.green(emoji.get('heavy_check_mark')), `skeleton screen has created in ${this.filepath}`);
    console.log(` %s  骨架屏已生成完毕.`, chalk.yellow(emoji.get('coffee')));
    // process.exit(0);
  }
}

module.exports = DrawPageStructure;


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
