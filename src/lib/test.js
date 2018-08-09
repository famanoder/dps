const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

function addHttpPrefix(host, filepath) {
  const html = fs.readFileSync(filepath).toString();
  const $ = cheerio.load(html);
  $('link').each(function() {
    let href = $(this)[0].attribs.href;
    if(href) {
      if(href.startsWith('//')) {
        href = 'http:' + href;
      }else if(!href.startsWith('http')) {
        href = host + href;
      }
      $(this).attr('href', href);
    }
  });
  $('script').each(function() {
    let src = $(this)[0].attribs.src;
    if(src) {
      if(src.startsWith('//')) {
        src = 'http:' + src;
      }else if(!src.startsWith('http')) {
        src = host + src;
      }
      $(this).attr('src', src);
    }
  });
  fs.writeFileSync(filepath, $.html('html'));
}
addHttpPrefix('123',path.resolve(__dirname, '../../index.html'));