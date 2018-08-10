module.exports = function() {

  const option = parseParams(arguments);
  const blocks = [];
  function drawBlock({width, height, top, left, zIndex = 9999999, background = '#eee', radius} = {}) {
    const styles = [
      'position: fixed',
      'z-index: '+zIndex,
      'top: '+top+'%',
      'left: '+left+'%',
      'width: '+width+'%',
      'height: '+height+'%',
      'background: '+background,
      'border-radius: '+radius
    ].join(';');
    blocks.push(`<div style="${styles}"></div>`);
  }

  function getArgtype(arg){
    return Object.prototype.toString.call(arg).toLowerCase().match(/\s(\w+)/)[1];
  }

  function getStyle(node, attr) {
    return node.nodeType === 1? getComputedStyle(node)[attr]: '';
  }

  function DrawPageframe(opts) {
    this.rootNode = opts.rootNode || document.body;
    this.offsetTop = opts.offsetTop || 0;
    this.includeElement = opts.includeElement;
    this.init = opts.init;

    return this instanceof DrawPageframe? this: new DrawPageframe(opts); 
  }

  function wPercent(x) {
    return parseFloat(x/window.innerWidth*100).toFixed(3);
  }

  function hPercent(x) {
    return parseFloat(x/window.innerHeight*100).toFixed(3);
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

  const win_w = window.innerWidth;
  const win_h = window.innerHeight;

  DrawPageframe.prototype = {
    resetDOM: function() {
      this.init && this.init();
      window.scrollTo(0, this.offsetTop);
      drawBlock({
        width: 100, 
        height: 100, 
        top: 0, 
        left: 0, 
        zIndex: 9999990,
        background: '#fff'
      });
    },
    showBlocks: function() {
      if(blocks.length) {
        const { body } = document;
        const blocksHTML = blocks.join('');
        const div = document.createElement('div');
        div.innerHTML = blocksHTML;
        document.body.appendChild(div);
        return blocksHTML;
      }
    },

    startDraw: function() {
      let $this = this;
      this.resetDOM();
      const nodes = this.rootNode.childNodes;
      
      function deepFindTextNode(nodes) {
        if(nodes.length) {
          for(let i = 0; i < nodes.length; i++) {

            let node = nodes[i];
            if(isHideStyle(node) || (getArgtype($this.includeElement) === 'function' && $this.includeElement(node, drawBlock) == false)) continue;
            let childNodes = node.childNodes;
            let hasChildText = false;
            let background = getStyle(node, 'backgroundImage');
            let backgroundHasurl = background.match(/url\(.+?\)/);

            backgroundHasurl = backgroundHasurl && backgroundHasurl.length;

            if(childNodes && childNodes.length) {
              for(let j = 0; j < childNodes.length; j++) {
                if(childNodes[j].nodeType === 3 && childNodes[j].textContent.trim().length) {
                  hasChildText = true;
                  break;
                }
              }
              if(!hasChildText) {
                deepFindTextNode(childNodes);
              }
            }
            if((node.nodeType === 3 && node.textContent.trim().length) || 
              includeElement(['img', 'input', 'textarea', 'svg', 'canvas', 'video', 'audio'], node) || 
              backgroundHasurl ||
              hasChildText) {
                let rect = node.getBoundingClientRect();
                let { top: t, left: l, width: w, height: h } = rect;
                
                if(w > 0 && h > 0 && l >= 0 && l < win_w && t < win_h - 100 && t >= 0 && h < win_h/2) {
                  let paddingTop = parseInt(getStyle(node, 'paddingTop'));
                  let paddingLeft = parseInt(getStyle(node, 'paddingLeft'));
                  let paddingBottom = parseInt(getStyle(node, 'paddingBottom'));
                  let paddingRight = parseInt(getStyle(node, 'paddingRight'));
                  drawBlock({
                    width: wPercent(rect.width - paddingLeft - paddingRight), 
                    height: hPercent(rect.height - paddingTop - paddingBottom), 
                    top: hPercent(rect.top + paddingTop), 
                    left: wPercent(rect.left + paddingLeft),
                    radius: getStyle(node, 'border-radius')
                  });
                  console.log(node);
                }
            }
          }
        }
      }

      deepFindTextNode(nodes);
      return this.showBlocks();
    }
  }

  function parseParams(params) {
    let options = [];
    if(params.length) {
      for(let i in [0, 1]) {
        let fn = eval('(' + params[i] + ')');
        if(fn) {
          options[i] = fn;
        }
      }
    }
    return options;
  }
  return new Promise((resolve, reject) => {   
    setTimeout(() => {
      const html = new DrawPageframe({
        init: option[0],
        includeElement: option[1]
      }).startDraw();
      resolve(html);
    }, 300);
  }); 

}
