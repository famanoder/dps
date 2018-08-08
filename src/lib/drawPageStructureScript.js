module.exports = evalScripts;

async function evalScripts() {
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
    this.excludeElement = opts.ignoreElement;
    this.beforeDraw = opts.beforeDraw;
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
      this.beforeDraw && this.beforeDraw();
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
            if(isHideStyle(node) || $this.includeElement(node, drawBlock) == false) continue;
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
  return new Promise((resolve, reject) => {   
    setTimeout(function() {
      const html = new DrawPageframe({
        includeElement: function(node, draw) {
          if(node.id == 'weather') {
            return false;
          }
          if(node.tagName.toLowerCase()=='header') {
            draw({
              width: 100,
              height: 8,
              left: 0,
              top: 0,
              zIndex: 99999999,
              background: '#F63515'
            });return false;
          } 
        },
        beforeDraw: function() {
          let modal = document.querySelector('.modal');
          modal && modal.parentNode.removeChild(modal);
        }
      }).startDraw();
      resolve(html);
    }, 300);
  }); 

}