# DrawPageStructure
a way to make skeleton screen

### usage
1. git clone http://git.jd.com/hufeng10/DrawPageStructure.git
2. 修改`drawPageConfig.js`；
3. `npm start`

### 参数说明
| 参数 | 说明 | 默认值 | 是否必填
|----- | ----- | ----- | -----
| url | 待生成骨架屏的页面地址 | -- | 是
| output.filepath | 生成的骨架屏节点写入的文件 | -- | 是
| output.injectSelector | 骨架屏节点插入的位置 | #app | 否
| init | 开始生成之前的操作 | -- | 否
| includeElement(node, draw) | 定制某个节点如何生成 | -- | 否
| writePageStructure(html, filepath) | 回调的骨架屏节点 | -- | 否
