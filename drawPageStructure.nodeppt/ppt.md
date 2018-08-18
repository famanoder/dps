title: 骨架屏自动生成方案 演示
speaker: 胡峰
url: http://git.jd.com/hufeng10/DrawPageStructure
transition: zoomout
theme: moon

[slide]
# DrawPageStructure
## 用最接近前端的方式自动生成页面骨架屏
[slide]
## 为什么需要自动生成骨架屏？
* 提高效率，节约单独编写代码的时间 {:&.rollIn}
* 替换原来单一的loading图片效果
* 可以优化用户体验，在页面数据尚未加载完成前<br>先给用户展示出页面的大致结构，配合动画效果，<br>给用户一种平滑切换的感觉 

[slide]
## 当前常见的方案
1. 手动编写骨架屏代码 {:&.rollIn}
2. 通过预渲染手动书写的代码生成相应的骨架屏
<br>比如：vue-skeleton-webpack-plugin
3. 饿了么内部的生成骨架页面的工具
<br>page-skeleton-webpack-plugin
4. 我们的DrawPageStructure
[slide]
## 为什么我们也自己开发一个骨架屏生成工具？
[slide]
## 因为，我们不一样！
[slide]
### 我们的方案
<img src="/img/structure.png" style="height:400px;border-radius:8px;margin-top:30px;" />
[slide]
### 编写操作DOM的Javascript脚本
<div style="font-size: 22px;margin-top: 20px;">
<ul>
<li>遍历可见区域可见的DOM节点<br>
包括：非隐藏元素、宽高大于0的元素、非透明元素、内容不是空格的元素、<br>位于浏览窗口可见区域内的元素
</li>
<li>针对（背景）图片、文字、表单项、音频视频等区域，算出其所占区域的宽、<br>高、距离视口的绝对距离等信息，生成相应的颜色块</li>
</ul>
</div>
[slide]
## Puppeteer
----
> Puppeteer是谷歌官方出品的一个可以控制headless Chrome的Node库。<br>
可以通过Puppeteer的提供的api直接控制Chrome模拟大部分用户操作来<br>进行UI Test或者作为爬虫访问页面来收集数据。

[slide]
### Puppeteer提供运行环境和导出方式
4. 使用puppeteer运行需要生成骨架屏的页面
5. 将之前编写的Javascript脚本通过puppeteer提前注入到该页面，<br>这样即可运行该脚本，并生成骨架屏所需的DOM节点
6. 将自动生成的骨架屏DOM片段插入到应用页面的入口节点
[slide]
### 在浏览器内运行，手动添加到应用页面
----
```javascript
    const createSkeletonHTML = require('DrawPageStructure/evalDOM')

    createSkeletonHTML({
        // ...
        background: 'red',
        animation: 'opacity 1s linear infinite;'
    }).then(skeletonHTML => {
        console.log(skeletonHTML)
    }).catch(e => {
        console.error(e)
    })
```
* 支持直接在浏览器端运行，在控制台打印当前页面骨架屏节点，复制添加到应用页面

[slide]
## 小结
5. 我们内网通过puppeteer无头模式打开外网地址，必须延迟30秒 {:&.rollIn}
1. 核心在于DOM操作，puppeteer仅提供运行环境
1. 不受项目和框架的限制，vue和react等项目零修改即可复用
2. 生成色块的单位为百分比，不同手机设备显示统一
3. 支持自定义生成方式与导出方式
4. 不需要css-tree来提取样式
[slide]
* 还有很多细节优化中，多路由支持也在规划中
* 欢迎感兴趣的小伙伴一起加入！
[slide]
## Thank you!
