## 技术背景

开发移动端 Web 项目的时候，有一种弹性布局的方案是基于 rem 开发项目。

简单来说，应用淘宝 [lib-flexible](https://github.com/amfe/lib-flexible)（虽说有新方案 vw，暂时先不讨论）后，会根据窗口宽度大小在*document.body*节点计算生成*font-size*。然后该页面的所有节点元素可以使用 rem，依据根节点的 font-size 计算大小

> rem 作用于非根元素时，相对于根元素字体大小；rem 作用于根元素字体大小时，相对于其出初始字体大小 —— MDN

因为，项目中 css 基于 less 预处理，所有开始考虑如何设计一个 mixin，让自己不要手动计算设计稿尺寸对应到实际浏览器中的 rem，而是可以自动计算~

## 初期方案 -- mixin

通过接收原设计稿像素尺寸，最后可以计算出相应的 rem，mixin 简单如下：

```less
@default-w: 375px;
.convert(@px, @width: @default-w) {
  @var: unit(@px / @width) * 10;
  @rem: ~"@{var}rem";
}
```

使用方式：

```html
<div class="el-mixin"></div>
```

```less
.el-mixin {
  width: .convert(300px) [ @rem];
  height: .convert(150px) [ @rem];
  background: red;
}
```

## 优雅一点 -- @functions

当然同学们也发现了。`.convert(250px)[@rem]`这种方式略显冗长，还需要属性取值，于是我想起很久以前我用 Scss 开发的时候，可以很方便编写自定义转换函数（这里不展开），可比这种方式更简洁！那么 Less 有没有提供函数编写呢？

答案是有的！可以在 Less 中编写 Javascript 函数

首先需要在 Webpack 中对 less-loader 设置`javascriptEnabled`，使其支持编写 Javascript！

```js
// module.rules
...
{
  test: /\.less/,
  exclude: /node_modules/,
  use: ['style-loader', 'css-loader', {
    loader: 'less-loader',
    options: {
      javascriptEnabled: true
    }
  }],
}
...
```

然后就可以开始编写自己的 Javascript 函数啦！

```less
.remMixin() {
  @functions: ~`(
      function() {var clientWidth = "375px" ; function convert(size) {return typeof size ===
        "string" ? + size.replace("px", ""): size;} this.rem = function(size) {return convert(size) /
        convert(clientWidth) * 10 + "rem" ;}}
    ) () `;
}
.remMixin();
```

使用方式如下（因为写了 convert 函数，可以传数值或字符串都行）：

```less
.el-function {
  width: ~`rem("300px") `;
  height: ~`rem(150) `;
  background: blue;
}
```

**建议大家点击[rem 两种方案 mixin/function 示例效果](https://codepen.io/souliz/pen/YbwLgM)看看哦~**

这种写法毋庸置疑的更加简洁了。而且在 less 中引入编写原生 Javascript 的方式，可以发挥自己的想象力，编写许多转换函数从而减少重复工作量！

谢谢大家的阅读~希望能对大家的日常开发工作带来一点帮助~(●´∀ ｀ ●)ﾉ夜深了，写完睡觉~
