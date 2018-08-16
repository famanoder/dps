# DrawPageStructure
a way to make skeleton screen

### usage
1. git clone http://git.jd.com/hufeng10/DrawPageStructure.git
2. `cd DrawPageStructure && npm i`
2. 运行demo，`npm run example`
3. 开始生成骨架屏，`npm start`
4. 可修改`drawPageConfig.js`进行相关配置，对于DOM结构比较复杂和图片比较多且分布密集的情况，
    生成的骨架屏效果可能不尽如人意，这时候可以使用includeElement定制某个节点生成生成什么样
    子，或者使用init在生成骨架屏之前对DOM节点进行调整，比如删除干扰节点；

### 参数说明
| 参数 | 说明 | 默认值 | 是否必填
|----- | ----- | ----- | -----
| url | 待生成骨架屏的页面地址 | -- | 是
| output.filepath | 生成的骨架屏节点写入的文件 | -- | 是
| output.injectSelector | 骨架屏节点插入的位置 | #app | 否
| background | 骨架屏主题色 | #ecf0f2 | 否
| animation | css3动画属性 | -- | 否
| device | 设备类型 | mobile | 否
| init | 开始生成之前的操作 | -- | 否
| includeElement(node, draw) | 定制某个节点如何生成 | -- | 否
| writePageStructure(html, filepath) | 回调的骨架屏节点 | -- | 否
