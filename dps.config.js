
const dpsConfig = {
	url: 'http://baidu.com',      // 待生成骨架屏页面的地址，用百度（https://baidu.com）试试也可以
	output: {
		filepath: './example/index.html',   // 生成骨架屏的存放页面，一般为项目的入口页面
		injectSelector: 'app'  // 生成的骨架屏插入页面的节点
	},
	background: '#eee',
	header: {
		height: 50,
		background: 'rgb(58, 213, 197)'
	},
	animation: 'opacity 1s linear infinite;',
	includeElement: function(node, draw) {
		// 定制某个节点画出来的样子，带上return false
		// if(node.id == 'ui-alert') {
			// 跳过该节点及其子节点
			// return false;
		// }
		// if(node.tagName.toLowerCase() === 'img') {
			// 对该图片生成宽100%，高8%，颜色为红色的色块
			// draw({
				// width: 100,
				// height: 8,
				// left: 0,
				// top: 0,
				// zIndex: 99999999,
				// background: 'red'
			// });
			// return false;
		// } 
	},
	writePageStructure: function(html) {
		// 自己处理生成的骨架屏
		// fs.writeFileSync(filepath, html);
		// console.log(html)
	},
	headless: false,
	init: function() {
		// 生成骨架屏之前的操作，比如删除干扰节点
	}
}

module.exports = dpsConfig;

		