const fs = require('fs');
const cheerio = require('cheerio');
const { log, getAgrType, Spinner, calcText, genArgs } = require('./utils');
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
      this.rootNode = rootNode || '';
      this.header = header || '';
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
      if(header && getAgrType(header) !== 'object') {
        log.error('[header] should be an object !', 1);
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
      // html = await page.evaluate.call(
      //   page, 
      //   evalScripts, 
      //   this.init.toString(), 
      //   this.includeElement.toString(), 
      //   this.background, 
      //   this.animation,
      //   this.rootNode,
      //   this.header
      // );
      const agrs = genArgs.create({
        init: {
          type: 'function',
          value: this.init.toString()
        },
        includeElement: {
          type: 'function',
          value: this.includeElement.toString()
        }, 
        background: {
          type: 'string',
          value: this.background
        }, 
        animation: {
          type: 'string',
          value: this.animation
        },
        rootNode: {
          type: 'string',
          value: this.rootNode
        },
        header: {
          type: 'object',
          value: JSON.stringify(this.header)
        }
      });
      agrs.unshift(evalScripts);
      html = await page.evaluate.apply(page, agrs);
    }catch(e){
      log.error('\n[page.evaluate] ' + e.message);
    }
    // await page.screenshot({path: 'example.png'});
    // let base64 = fs.readFileSync(path.resolve(__dirname, '../example.png')).toString('base64');
    return html;

  }
  writeToFilepath(html) {
    let filepath = this.filepath;
    let fileHTML = fs.readFileSync(filepath);
    let $ = cheerio.load(fileHTML, {
      decodeEntities: false
    });
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
    }else if(this.filepath) {
      this.writeToFilepath(html);
    }else{
      log.warn('\nskeleton has created, but no way to exported.');
      log.warn("please check the config 'output, writePageStructure'.");
    }
    
    spinner.text = '骨架屏已生成完毕.';
    spinner.clear().succeed(`skeleton screen has created and output to ${calcText(this.filepath)}`);

    if(this.headless) {
      await pp.browser.close();
      process.exit(0);
    }
  }
}

module.exports = DrawPageStructure;
