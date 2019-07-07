## 前言
相信大部分前端同学都是用Chrome浏览器进行开发，这篇博客要分享的基本上是除了我们常用`console.log`之外的，Chrome开发者工具控制面板提供的调试方法~

首先在地址栏敲入：`about:blank` 创建一个空白页，再打开控制台~

开始操作演示~（多图预警！~~

## 关于console
关于console对象，其实提供了很丰富的API，可自查文档~

![](https://user-gold-cdn.xitu.io/2019/6/23/16b836c7eb77592f?w=1352&h=288&f=png&s=73072)

## 关于Console控制面板
以下示例方法只存在于Chrome控制台Console面板~在JavaScripts中写是没有的哦!

### $家族
#### $_
返回上一个被执行过的值~
![](https://user-gold-cdn.xitu.io/2019/6/23/16b8377c5fa623e3?w=1006&h=312&f=png&s=27696)

虽说很类似于命令行里的`!!`，但是$_并不会再执行一次表达式，如下图可证：
![](https://user-gold-cdn.xitu.io/2019/6/23/16b83872693bac52?w=996&h=210&f=png&s=23237)

如果之前的值没有保存在变量里，可以通过这个方法临时访问~（为什么说临时，因为当你执行完下一个表达式后，$_已经更新了哈）
![](https://user-gold-cdn.xitu.io/2019/6/23/16b838de56b73e00?w=998&h=288&f=png&s=47063)

#### $0 - $4
$0、$1、$2、$3、$4五个指令相当于在Elements面板最近选择过的五个引用。
比如我在Elements面板上随意点击了掘金网站上的五个DOM节点。从时间线上，$4是我第一个点击的。而$0是我第五个，也即是最后一个点击的。利用此方法可以快速在Console面板调试你选中的节点！
![](https://user-gold-cdn.xitu.io/2019/6/23/16b8395babe03406?w=1354&h=564&f=png&s=108164)

补充一下，还有点类似正则匹配~如下所示
```js
function replacer(match, $1, $2, $3, $4, $5) {
  return [$1, $2, $3, $4, $5].join(' - ');
}
const str = 'abc12345#$*%[hello]{world}'
    .replace(/([^\d]*)(\d*)([^\w]*)(\[.*\])(\{.*\})/, replacer);

console.log(str); // abc - 12345 - #$*% - [hello] - {world}
```

#### $
类似于`document.querySelector()`。不过比较少为人知的应该是它的第二个参数。指定从哪个节点开始选择。有时候想减少范围时，尤其管用！

![](https://user-gold-cdn.xitu.io/2019/6/23/16b83aa6da347354?w=1384&h=392&f=png&s=92944)

P.S. 函数签名`$(selector, [startNode])`。

#### $$
类似于`document.querySelectorAll()`，可参考同上。

P.S. 函数签名`$$(selector, [startNode])`

#### $x
根据XPath表达式去查找节点。如下图示例：
![](https://user-gold-cdn.xitu.io/2019/6/23/16b83c0e1f4b970c?w=1278&h=624&f=png&s=240156)

查找掘金站内所有含有href属性的a节点，然后遍历过滤含有http或https的节点~
当然好像目前来说，大部分情况直接用`$`、`$$`可以覆盖，说不定特殊情况下`$x`会很有用。有需要的同学可以了解学习一下~
XPath表达式规则可参考：https://www.w3schools.com/xml/xpath_syntax.asp

P.S. 函数签名`$x(selector, [startNode])`

### API工具方法
以下方法同样只存在于Chrome控制台Console面板里，同学们请注意哦~

#### keys/values
见名知意。功能类似于`Object.keys`，`Object.values`
![](https://user-gold-cdn.xitu.io/2019/6/23/16b83ccc85bb2ea9?w=1384&h=606&f=png&s=127021)

#### monitor/unmonitor
用来观察函数调用的工具方法。在函数调用的时候，可以同步输出函数名以及参数。

![](https://user-gold-cdn.xitu.io/2019/6/23/16b840e55e72de2a?w=1126&h=572&f=png&s=70087)

当不再需要观察该函数时，调用unmonitor取消即可。

但是匿名函数不会生效，因为获取不到名字.

![](https://user-gold-cdn.xitu.io/2019/6/23/16b841018b846e54?w=778&h=142&f=png&s=14757)

#### monitorEvents/unmonitorEvents
可以观察对像的事件~

![](https://user-gold-cdn.xitu.io/2019/6/23/16b84123a97d0532?w=1192&h=418&f=png&s=103498)

也可以同时观察对象的多个事件~

![](https://user-gold-cdn.xitu.io/2019/6/23/16b8413ad5205cde?w=1200&h=328&f=png&s=86767)

同样，使用unmonitorEvents取消观察。结合以上的$家族一起使用更便利哦
![](https://user-gold-cdn.xitu.io/2019/6/23/16b841866add55f8?w=1180&h=324&f=png&s=82400)

P.S. 函数签名：`monitorEvents(object[, events])`

#### copy
快速拷贝一个对象为字符串表示方式到剪切板~
![](https://user-gold-cdn.xitu.io/2019/6/23/16b843a2416f3056?w=794&h=416&f=png&s=39872)

#### getEventListeners
获取注册到一个对象上的所有事件监听器~
![](https://user-gold-cdn.xitu.io/2019/6/23/16b843bf70a171a7?w=1298&h=356&f=png&s=68721)

其实还有内置的inspect、debug/undebug等方法，大家可以自行搜索，都很有用~这里就不一一介绍了~

## 关于断点调试
断点调试十分重要，以往我们可能直接在代码里添加debugger，然后刷新浏览器调试。实际上除了这种方法外还有很多种断点。
### DOM breakpoint
在Elements面板，右键点击节点唤出菜单，添加对应的DOM断点，可以监测指定节点的子树修改、属性修改、以及节点的移除。
![](https://user-gold-cdn.xitu.io/2019/6/23/16b841ecf5f823fa?w=832&h=292&f=png&s=308813)
### Source breakpoint
有时候无需在源码中添加debugger。直接在Source面板添加断点即可调试。见下图行号上的小蓝色箭头！

![](https://user-gold-cdn.xitu.io/2019/6/23/16b8425d6683bbd0?w=900&h=346&f=png&s=102291)

### Conditional breakpoint
条件断点。只有符合条件时，才会触发断点。见下图行号上的小橙色箭头！
![](https://user-gold-cdn.xitu.io/2019/6/23/16b8428ffe44bf5b?w=980&h=260&f=png&s=177595)

![](https://user-gold-cdn.xitu.io/2019/6/23/16b842d201cf882d?w=1000&h=320&f=png&s=58191)

![](https://user-gold-cdn.xitu.io/2019/6/23/16b842de33b638f5?w=976&h=240&f=png&s=52114)

除此之外，还有blackbox、XHR(fetch) breakpoint等各种Chrome提供的工具，建议同学们多去了解一下，说不定关键时候可以发挥很大的作用~

## 小技巧
如果找不到对应的指令，可以在控制台使用快捷键Ctrl + Shift + P。MacOS的话就是Command + Shift + P（这个和编辑器是一样的道理）。快速搜索你想要的控制面板工具~

![](https://user-gold-cdn.xitu.io/2019/6/23/16b8436074e9d52e?w=1280&h=744&f=png&s=94302)

## 小结
其实长久以来，我也一直只会用console.log和简单的debugger来调试Web应用，有时候遇到复杂的问题时，匮乏的调试方法种类难以快速定位问题，从而降低工作效率。因此针对此类情况，学习如何更好的调试相信是会对工作有极大的帮助！

最后，欢迎同学们补充或指正这些调试工具方法~

当然，对大家如有帮助，不甚荣幸~