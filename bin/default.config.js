
module.exports = {
    filename: 'dps.config.js',
		getTemplate: function(conf = {}) {
			return `
const drawConfig = {
	url: '${conf.url}',      // 待生成骨架屏页面的地址，用百度（https://baidu.com）试试也可以
	output: {
		filepath: '${conf.filepath}',   // 生成骨架屏的存放页面，一般为项目的入口页面
		injectSelector: '#app'  // 生成的骨架屏插入页面的节点
	},
	background: '#eee',
	animation: 'opacity 1s linear infinite;',
	includeElement: function(node, draw) {
		// 定制某个节点画出来的样子，带上return false
		// if(node.id == 'weather') {
		// 	return false;
		// }
		// if(node.tagName.toLowerCase()=='img') {
		//   draw({
		//     width: 100,
		//     height: 8,
		//     left: 0,
		//     top: 0,
		//     zIndex: 99999999,
		//     background: '#F63515'
		//   });
		//	 return false;
		// } 
	},
	writePageStructure: function(html) {
		// 自己处理生成的骨架屏
		// fs.writeFileSync(filepath, html);
		// console.log(html)
	},
	init: function() {
		// 生成骨架屏之前的操作，比如删除干扰节点
	}
}

module.exports = drawConfig;

		`
		}
}