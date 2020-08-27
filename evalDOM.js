module.exports = function evalDOM() {
  const ELEMENTS = ['audio', 'button', 'canvas', 'code', 'img', 'input', 'pre', 'svg', 'textarea', 'video', 'xmp'];
  const blocks = [];
  const win_w = window.innerWidth;
  const win_h = window.innerHeight;

  let agrsArr = arguments;
  if (!agrsArr.length) agrsArr = {length: 1, 0: {}};
  let agrs = agrsArr[0];
  
  if (agrsArr.length !== 1 || getArgtype(agrs) !== 'object') {
    agrs = parseAgrs([...agrsArr]);
  }

  const classProps = {
    position: 'fixed',
    zIndex: 999,
    background: agrs.background
  }
  if (agrs.animation) {
    classProps.animation = agrs.animation;
  }

  createCommonClass(classProps);

  function drawBlock({width, height, top, left, zIndex = 999, background = agrs.background, radius, subClas} = {}) {
    const styles = ['height:' + height + '%'];

    if (!subClas) {
      styles.push('top:' + top + '%', 'left:' + left + '%', 'width:' + width + '%');
    }

    if (classProps.zIndex !== zIndex) {
      styles.push('z-index:' + zIndex);
    }

    if (classProps.background !== background) {
      styles.push('background:' + background);
    }

    radius && radius != '0px' && styles.push('border-radius:' + radius);
    blocks.push(`<div class="_${subClas ? ' __' : ''}" style="${styles.join(';')}"></div>`);
  }

  function wPercent(x) {
    return parseFloat(x / win_w * 100).toFixed(3);
  }
  
  function hPercent(x) {
    return parseFloat(x / win_h * 100).toFixed(3);
  }

  function noop() {}

  function getArgtype(arg) {
    return Object.prototype.toString.call(arg).toLowerCase().match(/\s(\w+)/)[1];
  }

  function getStyle(node, attr) {
    return (node.nodeType === 1 ? getComputedStyle(node)[attr] : '') || '';
  }

  function getRootNode(el) {
    if (!el) return el;
    return typeof el === 'object' ?
            el:
            (getArgtype(el) === 'string' ?
            document.querySelector(el):
            null);
  }

  function includeElement(elements, node) {
    return ~elements.indexOf((node.tagName || '').toLowerCase());
  }

  function isHideStyle(node) {
    return getStyle(node, 'display') === 'none' || 
        getStyle(node, 'visibility') === 'hidden' || 
        getStyle(node, 'opacity') == 0 ||
        node.hidden;
  }

  function isCustomCardBlock(node) {
    const bgStyle = getStyle(node, 'background');
    const bgColorReg = /rgba\([\s\S]+?0\)/ig;
    const bdReg = /(0px)|(none)/;
    const hasBgColor = !bgColorReg.test(bgStyle) || ~bgStyle.indexOf('gradient');
    const hasNoBorder = ['top', 'left', 'right', 'bottom'].some(item => {
      return bdReg.test(getStyle(node, 'border-' + item));
    });
    const {w, h} = getRect(node);
    const customCardBlock = !!(hasBgColor && (!hasNoBorder || getStyle(node, 'box-shadow') != 'none') && w > 0 && h > 0 && w < 0.95*win_w && h < 0.3*win_h);
    return customCardBlock;
  }

  function calcTextWidth(text, {fontSize, fontWeight} = {}) {
    if (!text) return 0;

    const div = document.createElement('div');
    div.innerHTML = text;
    div.style.cssText = [
      'position:absolute',
      'left:-99999px',
	    `height:${fontSize}`,
      `font-size:${fontSize}`,
      `font-weight:${fontWeight}`,
      'opacity:0'
    ].join(';');
    document.body.appendChild(div);
    const w = getStyle(div, 'width');
    const h = getStyle(div, 'height');
    document.body.removeChild(div);
    return {
      w: parseInt(w),
      h: parseInt(h)
    };
  }

  function getRect(node) {
    if (!node) return {};
    const { top: t, left: l, width: w, height: h } = node.getBoundingClientRect();
    return {t, l, w, h};
  }

  function getPadding(node) {
    return {
      paddingTop: parseInt(getStyle(node, 'paddingTop')),
      paddingLeft: parseInt(getStyle(node, 'paddingLeft')),
      paddingBottom: parseInt(getStyle(node, 'paddingBottom')),
      paddingRight: parseInt(getStyle(node, 'paddingRight'))
    }
  }

  function createCommonClass(props) {
    const inlineStyle = ['<style>._{'];
    for(let prop in props) {
      inlineStyle.push(`${prop === 'zIndex'? 'z-index': prop}:${props[prop]};`);
    }
    inlineStyle.push('}.__{top:0%;left:0%;width:100%;}</style>');
    blocks.push(inlineStyle.join(''));
  }

  function parseAgrs(agrs = []) {
    let params = {};
    agrs.forEach(agr => {
      const sep = agr.indexOf(':');
      const [appName, name, type] = agr.slice(0, sep).split('-');
      const val = agr.slice(sep + 1);
      params[name] = type === 'function'? eval('(' + val + ')'): 
                      type === 'object'? JSON.parse(val):
                      val;
    });
    return params;
  }

  function DrawPageframe(opts) {
    this.rootNode = getRootNode(opts.rootNode) || document.body;
    this.offsetTop = opts.offsetTop || 0;
    this.includeElement = opts.includeElement;
    this.init = opts.init;
    this.originStyle = {};

    return this instanceof DrawPageframe ? this : new DrawPageframe(opts); 
  }

  DrawPageframe.prototype = {
    resetDOM: function() {
      this.init && this.init();
      this.originStyle = {
        scrollTop: window.scrollY,
        bodyOverflow: getStyle(document.body, 'overflow')
      };
      window.scrollTo(0, this.offsetTop);
      document.body.style.cssText += 'overflow:hidden!important;';
      drawBlock({
        height: 100, 
        zIndex: 990,
        background: '#fff',
        subClas: true
      });
      this.withHeader();
    },
    inHeader: function(node) {
      if (agrs.header) {
        const height = parseInt(agrs.header.height);
        if (height) {
          const {t, l, w, h} = getRect(node);
          return t <= height;
        }
      }
    },
    withHeader: function() {
      if (agrs.header) {
        const {height, background} = agrs.header;
        const hHeight = parseInt(height);
        const hBackground = background || agrs.background;
        if (hHeight) {
          drawBlock({
            height: hPercent(hHeight), 
            zIndex: 999,
            background: hBackground,
            subClas: true
          });
        }
      }
    },
    showBlocks: function() {
      if (blocks.length) {
        const { body } = document;
        const blocksHTML = blocks.join('');
        const div = document.createElement('div');
        div.innerHTML = blocksHTML;
        body.appendChild(div);

        window.scrollTo(0, this.originStyle.scrollTop);
        document.body.style.overflow = this.originStyle.bodyOverflow;

        return blocksHTML;
      }
    },

    startDraw: function() {
      const $this = this;
      this.resetDOM();
      const nodes = this.rootNode.childNodes;
      
      function deepFindNode(nodes) {
        if (nodes.length) {
          for(let i = 0; i < nodes.length; i++) {
            
            let node = nodes[i];
            if (isHideStyle(node) || (getArgtype($this.includeElement) === 'function' && $this.includeElement(node, drawBlock) == false)) continue;
            let childNodes = node.childNodes;
            let hasChildText = false;
            let background = getStyle(node, 'backgroundImage');
            let backgroundHasurl = background.match(/url\(.+?\)/);
            
            backgroundHasurl = backgroundHasurl && backgroundHasurl.length;

            for(let j = 0; j < childNodes.length; j++) {
              if (childNodes[j].nodeType === 3 && childNodes[j].textContent.trim().length) {
                hasChildText = true;
                break;
              }
            }

            if ((includeElement(ELEMENTS, node) || 
              backgroundHasurl ||
              (node.nodeType === 3 && node.textContent.trim().length) || hasChildText ||
              isCustomCardBlock(node)) && !$this.inHeader(node)) {
                const {t, l, w, h} = getRect(node);
                
                if (w > 0 && h > 0 && l >= 0 && l < win_w && win_h - t >= 20 && t >= 0) {
                  const {
                    paddingTop,
                    paddingLeft,
                    paddingBottom,
                    paddingRight
                  } = getPadding(node);
                  drawBlock({
                    width: wPercent(w - paddingLeft - paddingRight), 
                    height: hPercent(h - paddingTop - paddingBottom), 
                    top: hPercent(t + paddingTop), 
                    left: wPercent(l + paddingLeft),
                    radius: getStyle(node, 'border-radius')
                  });
                }
            } else if (childNodes && childNodes.length) {
              if (!hasChildText) {
                deepFindNode(childNodes);
              }
            }
          }
        }
      }

      deepFindNode(nodes);
      return this.showBlocks();
    }
  }

  return new Promise((resolve, reject) => {   
    setTimeout(() => {
      try {
        const html = new DrawPageframe({
          init: agrs.init,
          rootNode: agrs.rootNode,
          includeElement: agrs.includeElement
        }).startDraw();
        resolve(html);
      } catch (e) {
        reject(e);
      }
    }, 1000);
  }); 

}
