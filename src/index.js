const fs = require('fs');
const chalk = require('chalk');
const cheerio = require('cheerio');
const { log, getAgrType, Spinner, emoji, calcText } = require('./utils');
const ppteer = require('./pp');
const evalScripts = require('../evalDOM');

class DrawPageStructure {
  constructor({
      url,
      output = {},
      background,
      animation,
      rootNode,
      header,
      device,
      headless,
      extraHTTPHeaders,
      writePageStructure,
      includeElement,
      init
    } = {}) {
      this.url = url;
      this.filepath = output.filepath;
      this.injectSelector = output.injectSelector || '#app';
      this.background = background || '#ecf0f2';
      this.animation = animation || '';
      this.rootNode = rootNode;
      this.header = header;
      this.device = device;
      this.headless = headless;
      this.extraHTTPHeaders = extraHTTPHeaders;
      this.writePageStructure = writePageStructure;
      this.includeElement = includeElement || function() {};
      this.init = init || function() {};

      if(this.headless === undefined) this.headless = true;

      if(!url) {
        log.error('please provide entry url !', 1); 
      }
      if(!output.filepath) {
        log.error('please provide output filepath !', 1); 
      }
      if(!fs.existsSync(output.filepath) || !fs.statSync(output.filepath).isFile()) {
        log.error('[output.filepath] should be a file !', 1); 
      }
      if(!fs.existsSync(output.filepath)) {
        log.error('[output.filepath:404] please provide the absolute filepath !', 1); 
      }
  }
  async generateSkeletonHTML(page) {
    let html = '';

    try{
      html = await page.evaluate.call(
        page, 
        evalScripts, 
        this.init.toString(), 
        this.includeElement.toString(), 
        this.background, 
        'dps-animation:this.animation',
        this.rootNode,
        this.header
      );
      html = await page.evaluate.apply(page, [

      ]);
    }catch(e){
      log.error('\n[page.evaluate] ' + e.message, 1);
    }
    // await page.screenshot({path: 'example.png'});
    // let base64 = fs.readFileSync(path.resolve(__dirname, '../example.png')).toString('base64');
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
    const page = await pp.openPage(pageUrl, this.extraHTTPHeaders);

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
    
    console.log(' %s ', chalk.green(emoji.get('heavy_check_mark')), `skeleton screen has created and output to ${calcText(this.filepath)}`);
    console.log(` %s  骨架屏已生成完毕.`, chalk.yellow(emoji.get('coffee')));

    if(this.headless) {
      await pp.browser.close();
      process.exit(0);
    }
  }
}

module.exports = DrawPageStructure;
